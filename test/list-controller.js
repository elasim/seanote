// process.exit(0);

import chai, { assert, expect } from 'chai';
import chaiPromise from 'chai-as-promised';

chai.use(chaiPromise);

// Override DB ConnStr
const config = require('../src/server/lib/config').default;
config.sequelize.connectionString = 'sqlite://:memomry:';
config.sequelize.logging = false;
// Prevent of Hositing
const sequelize = require('../src/server/data/sequelize').default;
const UserController = require('../src/server/controllers/user').default;
const ListController = require('../src/server/controllers/list').default;
const BoardController = require('../src/server/controllers/board').default;

/* globals describe, beforeEach, it */
describe('ListController', () => {
	let user1, user2;
	let boardsOfUser1, boardsOfUser2;

	beforeEach('prepare fixture', async (done) => {
		try {
			await sequelize.sync({ force: true });
			user1 = await UserController.createWithLogin('test1', 'test1');
			user2 = await UserController.createWithLogin('test2', 'test2');

			boardsOfUser1 = await BoardController.all(user1, {});
			boardsOfUser2 = await BoardController.all(user2, {});
			done();
		} catch (e) {
			done(e);
		}
	});

	describe('all()', () => {
		it('retrieve all lists which belongs to board', async (done) => {
			try {
				const lists = await ListController.all(user1, {
					board: boardsOfUser1.items[0].id
				});
				assert(lists.items.length === 2);
				done();
			} catch (e) {
				done(e);
			}
		});
		it('result must be sorted by priority', async (done) => {
			try {
				const lists = await ListController.all(user1, {
					board: boardsOfUser1.items[0].id
				});
				let last = 0;
				lists.items.forEach(list => {
					assert(list.priority > last);
					last = list.priority;
				});
				done();
			} catch (e) {
				done(e);
			}
		});
		it('throws permission error without read permission of board', () => {
			const selection = ListController.all(user1, {
				board: boardsOfUser2.items[0].id
			});
			return assert.isRejected(selection, /permission error/);
		});
	});
	describe('create()', () => {
		it('create new list with name', async (done) => {
			const t = { transaction: await sequelize.transaction() };
			try {
				const param = {
					board: boardsOfUser1.items[0].id,
					name: 'New List Item'
				};
				const newItem = await ListController.create(user1, param, t);
				const newLists = await BoardController.all(user1, {}, t);
				assert.equal(newItem.name, param.name);
				assert.equal(newItem.BoardId, boardsOfUser1.items[0].id);
				assert.equal(newItem.priority, 3.0);
				assert.equal(newLists.items.length, 3);
				await t.transaction.commit();
				done();
			} catch (e) {
				await t.transaction.rollback();
				done(e);
			}
		});
		it('throws permission error without write permission of board', () => {
			const creation = ListController.create(user1, {
				board: boardsOfUser2.items[0].id,
				name: 'New List Item'
			});
			return assert.isRejected(creation, /permission error/);
		});
	});
	describe('get()', () => {
		it('throws permission error without read permission of board', async () => {
			const lists = await ListController.all(user2, {
				board: boardsOfUser2.items[0].id
			});
			const read = ListController.get(user1, {
				board: boardsOfUser2.items[0].id,
				id: lists.items[0].id
			});
			return assert.isRejected(read, /permission error/);
		});
		it('throws invalid parameter error If list is not belongs to board',
			async () => {
				const lists = await ListController.all(user1, {
					board: boardsOfUser1.items[0].id
				});
				const read = ListController.get(user1, {
					board: boardsOfUser1.items[1].id,
					id: lists.items[0].id
				});
				return assert.isRejected(read, /invalid parameter/);
			}
		);
	});
	describe('update()', () => {

	});
	describe('delete()', () => {

	});

});
