/* globals describe, beforeEach, it */
import chai, { assert } from 'chai';
import chaiPromise from 'chai-as-promised';

chai.use(chaiPromise);

// override connection string to test
const config = require('../src/server/lib/config').default;
config.sequelize.connectionString = 'sqlite://:memomry:';
config.sequelize.logging = false;
// this test need to overwrite config, so don't use import (it will hoist)
const sequelize = require('../src/server/data/sequelize').default;
const User = require('../src/server/models/user').default;
const Board = require('../src/server/models/board').default;
const List = require('../src/server/models/list').default;

describe('List', () => {
	let user1, user2;
	let boardsOfUser1, boardsOfUser2;

	beforeEach('prepare fixture', async (done) => {
		try {
			await sequelize.sync({ force: true });
			user1 = await User.createWithLogin('test1', 'test1');
			user2 = await User.createWithLogin('test2', 'test2');

			boardsOfUser1 = await Board.all(user1, {});
			boardsOfUser2 = await Board.all(user2, {});
			done();
		} catch (e) {
			done(e);
		}
	});

	describe('all()', () => {
		it('retrieve all lists which belongs to board', async (done) => {
			try {
				const lists = await List.all(user1, {
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
				const lists = await List.all(user1, {
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
			const selection = List.all(user1, {
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
				const newItem = await List.create(user1, param, t);
				const newLists = await Board.all(user1, {}, t);
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
			const creation = List.create(user1, {
				board: boardsOfUser2.items[0].id,
				name: 'New List Item'
			});
			return assert.isRejected(creation, /permission error/);
		});
	});
	describe('get()', () => {
		it('throws permission error without read permission of board', async () => {
			const board = boardsOfUser2.items[0].id;
			const lists = await List.all(user2, { board });
			const read = List.get(user1, {
				id: lists.items[0].id,
				board,
			});
			return assert.isRejected(read, /permission error/);
		});
		it('throws invalid parameter error If list is not belongs to board',
			async () => {
				const lists = await List.all(user1, {
					board: boardsOfUser1.items[0].id
				});
				const read = List.get(user1, {
					id: lists.items[0].id,
					board: boardsOfUser1.items[1].id,
				});
				return assert.isRejected(read, /invalid parameter/);
			}
		);
	});
	describe('update()', () => {
		it('throws permission error without write permission of board',
			async () => {
				const board = boardsOfUser2.items[0].id;
				const lists = await List.all(user2, { board });
				const update = List.update(user1, {
					id: lists.items[0].id,
					board,
				});
				return assert.isRejected(update, /permission error/);
			}
		);
		it('updated data should be returned',
			async () => {
				const board = boardsOfUser1.items[0].id;
				const lists = await List.all(user1, { board });
				const expected = {
					name: 'NEW EXPECTED NAME',
					isClosed: 1,
				};
				const result = await List.update(user1, {
					id: lists.items[0].id,
					board,
					name: expected.name,
					isClosed: expected.isClosed,
				});
				assert.equal(result.name, expected.name);
				assert.equal(result.isClosed, true);
			}
		);
	});
	describe('delete()', () => {
		it('throws permission ereror without write permission of board',
			async () => {
				const board = boardsOfUser2.items[0].id;
				const lists = await List.all(user2, { board });
				const deletion = List.delete(user1, {
					id: lists.items[0].id,
					board,
				});
				return assert.isRejected(deletion, /permission error/);
			}
		);
		it('list cannot be found after delete',
			async () => {
				const board = boardsOfUser1.items[0].id;
				const lists = await List.all(user1, { board });
				const target = lists.items[0].id;
				await List.delete(user1, {
					id: target,
					board,
				});
				const invalidGet = List.get(user1, {
					id: target,
					board,
				});
				return assert.isRejected(invalidGet, /invalid parameter/);
			}
		);
	});
	describe('sort()', () => {
		it('throws permission error without write permission of board',
			async () => {
				const board = boardsOfUser1.items[0].id;
				const lists = await List.all(user1, { board });
				const target = lists.items[0].id;
				const sort = List.sort(user2, {
					id: target,
					board,
					value: 1.5
				});
				return assert.isRejected(sort, /permission error/);
			}
		);
		it('renumber when priority was set with redundant value',
			async () => {
				const board = boardsOfUser1.items[0].id;
				const lists = await List.all(user1, { board });
				const target = lists.items[0].id;
				const result = await List.sort(user1, {
					id: target,
					board,
					value: 2
				});
				assert.equal(result.renumber, true);
			}
		);
	});
	describe('renumber()', () => {
		it('throws permission error without write permission of board',
			async () => {
				const renumber = List.renumber(user1, {
					board: boardsOfUser2.items[0].id
				});
				return assert.isRejected(renumber, /permission error/);
			}
		);
		it('list order should be maintained after renumber executed',
			async () => {
				const board = boardsOfUser1.items[0].id;
				const lists = await List.all(user1, { board });
				await List.sort(user1, {
					id: lists.items[0].id,
					board,
					value: 1.5
				});
				await List.renumber(user1, { board });
				List.all(user1, { board });
			}
		);
	});
});
