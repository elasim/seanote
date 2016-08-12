import Validator from 'validator';
import validate from './validation';
import { assign, $bindRight, $or, $not } from '../lib/functional';
import isUndefined from 'lodash/isUndefined';
import { Lists } from '../data/schema/list';
import { Cards } from '../data/schema/card';
import sequelize from '../data/sequelize';
import Board from './board';
import { beginTransaction, commit, rollback, } from './helpers';

const debug = require('debug')('app.model.List');

const VALID_NAME_MAX = 140;
const VALID_PRIORITY_MIN = Number.EPSILON * 1000;

const MODE = Board.Mode;

export default new class List {
	async all(user, { board }, options = {}) {
		debug('all(): %s %s', board, typeof board);
		await validate(Validator.isUUID, board);
		await test(user, board, MODE.READ, options);

		const lists = await Lists.findAll({
			where: { BoardId: board },
			include: [Cards],
			order: ['List.priority', 'Cards.priority']
		});
		return {
			id: board,
			items: lists,
		};
	}
	async create(user, { board, name }, options = {}) {
		debug('create()', board, typeof board);
		debug('create()', name, typeof name);
		await validate(Validator.isUUID, board);
		await validate(Validator.isLength, name, {
			min: 1,
			max: VALID_NAME_MAX,
		});
		await test(user, board, MODE.WRITE, options);

		const transaction = await beginTransaction(options);
		try {
			const maxPriority = await Lists.max('priority', {
				where: { BoardId: board, },
				transaction,
			});
			const item = await Lists.create({
				BoardId: board,
				name,
				priority: Math.floor(maxPriority) + 1,
			}, {
				transaction: options.transaction
			});
			await commit(transaction, options);
			return item;
		} catch (e) {
			await rollback(transaction, options);
			throw e;
		}
	}
	async get(user, { board, id }, options = {}) {
		debug('get()', board, typeof board);
		debug('get()', id, typeof id);
		await validate(Validator.isUUID, board);
		await validate(Validator.isUUID, id);
		await test(user, board, MODE.READ, options);

		const item = await Lists.find({
			where: {
				BoardId: board,
				id,
			}
		}, {
			transaction: options.transaction
		});
		if (item === null) {
			throw new Error('invalid parameter');
		}
		return item;
	}
	async update(user, { board, id, name, isClosed }, options = {}) {
		debug('update()', board, typeof board);
		debug('update()', id, typeof id);
		debug('update()', name, typeof name);
		debug('update()', isClosed, typeof isClosed);
		await validate(Validator.isUUID, board);
		await validate(Validator.isUUID, id);
		await validate($or(isUndefined, $bindRight(Validator.isLength, {
			min: 1,
			max: VALID_NAME_MAX,
		})), name);
		await validate(validate.isOneOf, isClosed, [0, 1, undefined]);
		await test(user, board, MODE.WRITE, options);

		const list = await Lists.find({
			where: {
				id,
				BoardId: board,
			},
			transaction: options.transaction
		});

		if (list === null) {
			throw new Error('invalid parameter');
		}

		assign(list, 'name', name, $not(isUndefined));
		assign(list, 'isClosed', isClosed, $not(isUndefined));

		return list.save({
			transaction: options.transaction
		});
	}
	async delete(user, { board, id }, options = {}) {
		debug('delete()', board, typeof board);
		debug('delete()', id, typeof id);
		await validate(Validator.isUUID, board);
		await validate(Validator.isUUID, id);
		await test(user, board, MODE.WRITE, options);

		const transaction = await beginTransaction(options);
		try {
			const affectedRows = await Lists.destroy({
				where: {
					id,
					BoardId: board,
				},
				transaction,
			});
			if (affectedRows === 0) {
				throw new Error('not found');
			}
			// failsafe, just in case
			if (affectedRows !== 1) {
				throw new Error('unexpected result');
			}
			await commit(transaction, options);
		} catch (e) {
			await rollback(transaction, options);
			throw e;
		}
	}
	async sort(user, { board, id, value }, options = {}) {
		debug('sort()', board, typeof board);
		debug('sort()', id, typeof id);
		debug('sort()', value, typeof id);
		await validate(Validator.isUUID, board);
		await validate(Validator.isUUID, id);
		await validate(v => v >= VALID_PRIORITY_MIN, value);
		await test(user, board, MODE.WRITE, options);

		const transaction = await beginTransaction(options);
		let renumber = false;
		try {
			const list = await Lists.find({
				where: {
					BoardId: board,
					id,
				},
				transaction,
			});
			list.priority = value;
			await list.save({ transaction });
			const equals = await Lists.count({
				where: {
					BoardId: board,
					priority: value
				},
				transaction,
			});
			debug('sort() fail-safe, equal counts: ', equals);
			if (equals > 1) {
				await this.renumber(user, { board }, { transaction });
				renumber = true;
			}
			await commit(transaction, options);
		} catch (e) {
			await rollback(transaction, options);
			throw e;
		}
		return {
			priority: value,
			renumber,
		};
	}
	async renumber(user, { board='' }={}, options = {}) {
		debug('renumber(): %s %s', board, typeof board, );
		await validate(Validator.isUUID, board, 4);
		await test(user, board, MODE.WRITE, options);

		const listTable = Lists.getTableName();
		const queries = `
			CREATE TEMP TABLE IF NOT EXISTS :BoardId (
				seq INTEGER PRIMARY KEY,
				id VARCHAR(255)
			);
			CREATE INDEX IF NOT EXISTS list_index
				ON :BoardId (seq);
			DELETE FROM :BoardId;
			INSERT INTO :BoardId (id)
				SELECT id FROM ${listTable}
					WHERE BoardId=:BoardId
					ORDER BY priority;
			UPDATE ${listTable}
				SET priority=(
					SELECT T.seq
					FROM :BoardId T
					WHERE
						T.id = ${listTable}.id
				)
				WHERE
					BoardId=:BoardId;
			DROP TABLE :BoardId;`
			.split(/;/g)
			.map(query => query.trim())
			.filter(query => query.length > 0);

		const transaction = await beginTransaction(options);
		try {
			for (let i = 0; i < queries.length; ++i) {
				await sequelize.query(queries[i], {
					replacements: {
						BoardId: board
					},
					transaction,
				});
			}
			await commit(transaction, options);
		} catch (e) {
			await rollback(transaction, options);
			throw e;
		}
	}
};

async function test(user, board, mode, options) {
	if (!await Board.test(user, board, mode, options)) {
		throw new Error('permission error');
	}
}
