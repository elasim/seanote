import Sequelize from 'sequelize';
import Validator from 'validator';
import validate from './validation';
import { Boards, BoardSorts, BoardPrivacySettings } from '../data/schema/board';
import sequelize from '../data/sequelize';

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const debug = require('debug')('app.BoardController');

const VALID_NAME_MAX = 140;
const VALID_PRIORITY_MIN = Number.EPSILON * 1000;

const TBL_BOARD_SORTS = BoardSorts.getTableName();

export default new class BoardController {
	async havePermission(user, board, privilege) {
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
		});
		return count === 1;
	}
	async create(user, { name, isPublic }, options = {}) {
		await validate(Validator.isLength, name, {
			min: 1,
			max: VALID_NAME_MAX,
		});
		await validate(value => typeof value === 'boolean', isPublic);

		const transaction = options.transaction || await sequelize.transaction();
		const t = { transaction };
		try {
			const count = await Boards.count(t);
			const board = await Boards.create({
				name,
				isPublic,
				PublisherId: user.PublisherId,
				AuthorId: user.id,
			}, t);
			await BoardPrivacySettings.bulkCreate([
				{
					BoardId: board.id,
					roleId: user.PublisherId,
					rule: 'write'
				},
				{
					BoardId: board.id,
					roleId: user.PublisherId,
					rule: 'read'
				}
			], t);
			const sort = await BoardSorts.create({
				UserId: user.id,
				BoardId: board.id,
				priority: count + 1,
			}, t);
			if (!options.transaction) {
				await transaction.commit();
			}
			return {
				...board.toJSON(),
				priority: sort.priority,
			};
		} catch (e) {
			debug(e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async update(user, { board, name, isPublic }, options = {}) {
		await validate(Validator.isLength, name, {
			min: 1,
			max: VALID_NAME_MAX,
		});
		await validate(value => value === 0 || value === 1, isPublic);
		await validate(async value => {
			return await BoardSorts.count({
				where: {
					BoardId: value,
					UserId: user.id
				}
			}) === 1;
		}, board);

		return await Boards.update({
			name,
			isPublic,
		}, {
			where: {
				id: board
			},
			transaction: options.transaction,
		});
	}
	async delete(user, { board }, options = {}) {
		await validate(async value => {
			return await BoardSorts.count({
				where: {
					BoardId: value,
					UserId: user.id
				}
			}) === 1;
		}, board);

		return await Boards.destroy({
			where: {
				BoardId: board
			},
			cascade: true,
			transaction: options.transaction,
		});
	}
	async all(user, { offset, limit }, options = {}) {
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

		const transaction = options.transaction || await sequelize.transaction();
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
						as: 'PrivacySetting',
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
				order: [
					'BoardSort.priority IS NULL',
					'BoardSort.priority ASC',
					'createdAt DESC',
				].join(','),
				transaction,
			});
			let maxPriority = 0;
			for (let i = 0; i < boards.rows.length; ++i) {
				if (!boards.rows[i].BoardSort) {
					const priority = 1.0 + Math.floor(maxPriority);
					debug('all() generate sort index', boards.rows[i].id, priority);
					boards.rows[i].BoardSort = {
						priority,
					};
					await BoardSorts.create({
						UserId: user.id,
						BoardId: boards.rows[i].id,
						priority,
					}, t);
					maxPriority = priority;
				} else {
					maxPriority = Math.max(
						maxPriority,
						boards.rows[i].BoardSort.priority
					);
				}
			}
			if (!options.transaction) {
				await transaction.commit();
			}
		} catch (e) {
			debug('all()', e);
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
			prev = boards.rows[0].BoardSort.priority;
			boards.rows.shift();
		}

		// results contain the last item
		if (paging.limit > boards.rows.length) {
			next = boards.count + 1;
		} else {
			next = boards[boards.rows.length - 1].BoardSort.priority;
			boards.rows.pop();
		}

		const items = boards.rows.map(row => ({
			id: row.id,
			AuthorId: row.AuthorId,
			PublisherId: row.PublisherId,
			name: row.name,
			priority: row.BoardSort.priority,
			permissions: row.PrivacySetting.map(priv => priv.rule),
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		}));

		return {
			items,
			prev,
			next,
			count: boards.count,
			offset: offset,
			limit: limit,
		};
	}
	async renumber(user, options = {}) {
		debug('renumber()', options.transaction
			? 'Use Extern Transaction' : 'Use Internal Transaction');
		const transaction = options.transaction || await sequelize.transaction();
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
			debug('renumber()', e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async sort(user, { BoardId, priority }, options = {}) {
		debug('sort()', BoardId, typeof BoardId);
		debug('sort()', priority, typeof priority);
		await validate(Validator.isUUID, BoardId, 4);
		await validate(value => {
			return !Number.isNaN(value) && value >= VALID_PRIORITY_MIN;
		}, priority);

		debug('sort()', options.transaction
			? 'Use Extern Transaction' : 'Use Internal Transaction');
		const transaction = options.transaction || await sequelize.transaction();

		try {
			const sort = await BoardSorts.find({
				where: {
					BoardId,
					UserId: user.id,
				},
				transaction
			});
			// If this request is sent by normal use-case,
			// this data should be already created by all() method during display
			// in other cases, It was possibly abnormal request
			if (!sort) {
				throw new Error('invalid parameter');
			}
			await debug('sort()', sort.priority, priority);
			sort.priority = priority;
			await sort.save({ transaction });
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
				this.renumber(user, options);
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
};
