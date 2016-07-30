import Sequelize from 'sequelize';
import Validator from 'validator';
import flatMap from 'lodash/flatMap';
import validate from './validation';
import { Boards, BoardSorts, BoardPrivacySettings } from '../data/schema/board';
import sequelize from '../data/sequelize';

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const debug = require('debug')('app.BoardController');

const VALID_NAME_MAX = 140;
const VALID_PRIORITY_MIN = Number.EPSILON * 1000;

const TBL_BOARD_SORTS = BoardSorts.getTableName();

export default new class BoardController {
	async havePermission(user, board, privilege, options = {}) {
		debug('can()', user.id, board, privilege);
		await validate(Validator.isUUID, board, 4);
		await validate(Validator.isIn, privilege, [
			'read',
			'write'
		]);
		const count = await BoardPrivacySettings.count({
			where: {
				BoardId: board,
				roleId: {
					$in: [
						user.PublisherId,
						...(await user.getGroups()).map(group => group.PublisherId),
					]
				},
				rule: privilege
			},
			benchmark: IS_DEBUG,
			transaction: options.transaction
		});
		return count === 1;
	}
	async all(user, { offset=0, limit=10 }, options = {}) {
		debug('all()', 'offset', offset, typeof offset);
		debug('all()', 'limit', limit, typeof limit);
		await validate(value => {
			return Number.isInteger(value) && value >= 0;
		}, offset);
		await validate(value => {
			return Number.isInteger(value) && value >= 1 && value <= 100;
		}, limit);

		const paging = {
			offset: offset + (offset > 0 ? -1 : 0),
			limit: limit + (offset > 0 ? 2 : 1),
		};

		const transaction = await beginTransaction(options);
		const t = { transaction };
		let boards;
		try {
			const groups = await user.getGroups(t);
			const readables = groups.map(group => group.PublisherId);
			readables.push(user.PublisherId);
			boards = await Boards.findAndCount({
				include: [
					{
						model: BoardPrivacySettings,
						as: 'PrivacySettings',
						where: {
							roleId: { $in: readables },
							rule: 'read'
						},
					},
					{
						model: BoardSorts,
						where: { UserId: user.id },
						required: false,
					},
				],
				...paging,
				order: [
					'BoardSorts.priority IS NULL',
					'BoardSorts.priority ASC',
					'createdAt DESC',
				].join(','),
				transaction,
			});
			let maxPriority = 0;
			for (let i = 0; i < boards.rows.length; ++i) {
				if (boards.rows[i].BoardSorts.length === 0) {
					const priority = 1.0 + Math.floor(maxPriority);
					debug('all() generate sort index', boards.rows[i].id, priority);
					boards.rows[i].BoardSorts.push(await BoardSorts.create({
						UserId: user.id,
						BoardId: boards.rows[i].id,
						priority,
					}, t));
					maxPriority = priority;
				} else {
					maxPriority = Math.max(
						maxPriority,
						boards.rows[i].BoardSorts[0].priority
					);
				}
			}
			if (!options.transaction) {
				await transaction.commit();
			}
		} catch (e) {
			//debug('all()', e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}

		let prev;
		let next;
		
		// results contain the first item
		if (offset === 0 || boards.rows.length === 0) {
			prev = 0.0;
		} else {
			const firstItem = boards.rows.shift();
			prev = firstItem.BoardSorts[0].priority;
		}

		// results contain the last item
		if (paging.limit > boards.rows.length) {
			next = boards.count + 1;
		} else {
			const lastItem = boards.rows.pop();
			next = lastItem.BoardSorts[0].priority;
		}

		const items = boards.rows.map(row => {
			return {
				id: row.id,
				AuthorId: row.AuthorId,
				PublisherId: row.PublisherId,
				name: row.name,
				priority: row.BoardSorts[0].priority,
				permissions: row.PrivacySettings.map(priv => priv.rule),
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			};
		});

		debug(boards.rows.length);

		return {
			items,
			prev,
			next,
			count: boards.count,
			offset: offset,
			limit: limit,
		};
	}
	async create(user, { name, isPublic }, options = {}) {
		debug('create()', name, typeof name);
		debug('create()', isPublic, typeof isPublic);
		await validate(Validator.isLength, name, {
			min: 1,
			max: VALID_NAME_MAX,
		});
		await validate(value => value === 0 || value === 1, isPublic);

		const transaction = await beginTransaction(options);
		try {
			const maxPriority = await BoardSorts.max('priority', {
				where: { UserId: user.id },
				transaction,
			});
			const board = await Boards.create({
				name,
				isPublic,
				PublisherId: user.PublisherId,
				AuthorId: user.id,
				BoardSorts: [{
					UserId: user.id,
					priority: Math.floor(maxPriority) + 1,
				}],
				PrivacySettings: [
					{
						roleId: user.PublisherId,
						rule: 'write'
					},
					{
						roleId: user.PublisherId,
						rule: 'read'
					}
				]
			}, {
				transaction,
				include: [
					{
						model: BoardSorts,
					},
					{
						model: BoardPrivacySettings,
						as: 'PrivacySettings',
						foreignKey: 'BoardId'
					}
				],
			});
			if (!options.transaction) {
				await transaction.commit();
			}
			return {
				...board.toJSON(),
				priority: board.BoardSorts[0].priority,
			};
		} catch (e) {
			//debug(e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async update(user, { board, name, isPublic }, options = {}) {
		debug('update()', board, typeof board);
		debug('update()', name, typeof name);
		debug('update()', isPublic, typeof isPublic);
		await validate(value => {
			return value === undefined
			|| Validator.isLength(value, {
				min: 1,
				max: VALID_NAME_MAX
			});
		}, name);
		await validate(validate.isOneOf, isPublic, [undefined, 0, 1]);

		try {
			const boardDb = await Boards.find(
				{
					where: {
						id: board,
					},
					include: [{
						model: BoardPrivacySettings,
						as: 'PrivacySettings',
						where: {
							BoardId: board,
							roleId: user.PublisherId,
							rule: 'write'
						},
						required: true,
					}],
					transaction: options.transaction
				}
			);
			if (!boardDb) {
				throw new Error('permission error');
			}
			if (name) boardDb.name = name;
			if (isPublic === 0 || isPublic === 1) boardDb.isPublic = 1;

			return boardDb.save({
				transaction: options.transaction
			});
		} catch (e) {
			//debug('update()', e);
			throw e;
		}
	}
	async delete(user, { board }, options = {}) {
		debug('delete()', board, typeof board);
		await validate(Validator.isUUID, board, 4);
		
		const transaction = await beginTransaction(options);
		try {
			const rows = await Boards.destroy({
				where: {
					id: board,
					AuthorId: user.id,
				},
				cascade: true,
				transaction,
			});
			if (rows !== 1) {
				throw new Error('permission error');
			}
			if (!options.transaction) {
				await transaction.commit();
			}
			return true;
		} catch (e) {
			//debug(e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async share(user, { board, to, permissions }, options = {}) {
		debug('share()', board, typeof board);
		debug('share()', to, typeof to);
		debug('share()', permissions, typeof permissions);
		await validate(Validator.isUUID, board, 4);
		await validate(value => {
			return validate.isArrayWith(value, Validator.isUUID, 4)
			|| Validator.isUUID(value, 4);
		}, to);
		await validate(value => {
			const tester = /^(read|write)$/;
			return validate.isArrayWith(value, (val) => {
				return tester.test(val);
			}) || tester.test(value);
		}, permissions);

		const grantUsers = [].concat(to);
		const grantPerms = [].concat(permissions);
		const rules = flatMap(grantUsers, user => {
			return grantPerms.map(perm => ({
				BoardId: board,
				roleId: user,
				rule: perm,
			}));
		});

		const results = [];
		const transaction = await beginTransaction(options);
		try {
			const managedGroups = await user.getManagedGroups({
				transaction
			});
			const boardData = await Boards.find({
				where: {
					id: board,
					$or: [
						{ AuthorId: user.id },
						{
							PublisherId: {
								$in: managedGroups.map(group => group.PublisherId)
							}
						}
					]
				},
				transaction,
			});
			if (!boardData) {
				throw new Error('permission error');
			}
			for (let i = 0; i < rules.length; ++i) {
				results.push(await BoardPrivacySettings.findOrCreate({
					where: rules[i],
					transaction
				}));
			}
			if (!options.transaction) {
				await transaction.commit();
			}
			return;
		} catch (e) {
			//debug('share()', e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async renumber(user, options = {}) {
		debug('renumber()');
		const queries = `
			CREATE TEMP TABLE IF NOT EXISTS :UserId (
				seq INTEGER PRIMARY KEY,
				id VARCHAR(255) 
			);
			CREATE INDEX IF NOT EXISTS board_index
				ON :UserId (seq);
			DELETE FROM :UserId;
			INSERT INTO :UserId (id)
				SELECT BoardId FROM ${TBL_BOARD_SORTS}
					WHERE UserId=:UserId
					ORDER BY priority;
			UPDATE BoardSorts
				SET priority=(
					SELECT T.seq
					FROM :UserId T
					WHERE
						T.id = BoardSorts.BoardId
				)
				WHERE
					UserId=:UserId;
			DROP TABLE :UserId;`
			.split(/;/g)
			.map(query => query.trim())
			.filter(query => query.length > 0);
		const transaction = await beginTransaction(options);

		try {
			for (let i = 0; i < queries.length; ++i) {
				await sequelize.query(queries[i], {
					replacements: {
						UserId: user.id
					},
					transaction,
				});
			}
			if (!options.transaction) {
				await transaction.commit();
			}
			return;
		} catch (e) {
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async sort(user, { board, priority }, options = {}) {
		debug('sort()', board, typeof board);
		debug('sort()', priority, typeof priority);
		await validate(Validator.isUUID, board, 4);
		await validate(value => {
			return !Number.isNaN(value) && value >= VALID_PRIORITY_MIN;
		}, priority);

		const transaction = await beginTransaction(options);
		let renumber = false;
		try {
			const permissions = await BoardPrivacySettings.count({
				where: {
					BoardId: board,
					roleId: user.PublisherId
				},
				defaults: {
					priority: priority
				},
				transaction,
			});
			if (permissions === 0) {
				throw new Error('invalid parameter');
			}
			const [sort, created] = await BoardSorts.findOrCreate({
				where: {
					BoardId: board,
					UserId: user.id
				},
				transaction
			});
			if (!created) {
				await debug('sort()', sort.priority, priority);
				sort.priority = priority;
				await sort.save({ transaction });
			}
			// Fall-Safe
			const equals = await BoardSorts.count({
				where: {
					UserId: user.id,
					priority
				},
				transaction,
			});
			debug('sort() fail-safe, equal counts: ', equals);
			if (equals > 1) {
				this.renumber(user, {
					transaction
				});
				renumber = true;
			}
			if (!options.transaction) {
				await transaction.commit();
			}
			return {
				renumber
			};
		} catch (e) {
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
};

function beginTransaction(opt) {
	debug(opt.transaction
		? 'use extern transaction' : 'use internal transaction');
	return opt.transaction || sequelize.transaction();
}
