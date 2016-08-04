import Sequelize from 'sequelize';
import Validator from 'validator';
import validate from './validation';
import { $bindRight, $or } from '../lib/functional';
import isUndefined from 'lodash/isUndefined';
import { Lists } from '../data/schema/list';
import { Cards } from '../data/schema/card';
import BoardController from './board';
import { beginTransaction, commit, rollback, } from './helpers';

const debug = require('debug')('app.ListController');

const VALID_NAME_MAX = 140;

const MODE = BoardController.Mode;

export default new class ListController {
	async renumber(user, { board }, options = {}) {
		debug('renumber(): %s %s', board, typeof board, );
		await test(user, board, MODE.WRITE, options);
	}
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
				where: {
					BoardId: board,
				},
				transaction,
			});
			return Lists.create({
				BoardId: board,
				name,
				priority: Math.floor(maxPriority) + 1,
			}, {
				transaction: options.transaction
			});
			await commit(transaction, options);
		} catch (e) {
			await rollback(transaction, options);
			throw e;
		}
	}
	async get(user, { board, id }, options = {}) {
		debug('create()', board, typeof board);
		debug('create()', id, typeof id);
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
	async update(user, { board, id, name, isClose }, options = {}) {
		debug('create()', board, typeof board);
		debug('create()', id, typeof id);
		debug('create()', name, typeof name);
		debug('create()', isClose, typeof isClose);
		await validate(Validator.isUUID, board);
		await validate(Validator.isUUID, id);
		await validate($or(isUndefined, $bindRight(Validator.isLength, {
			min: 1,
			max: VALID_NAME_MAX,
		})), name);

		
	}
};

async function test(user, board, mode, options) {
	if (!await BoardController.test(user, board, mode, options)) {
		throw new Error('permission error');
	}
}
