// process.exit(0);

import chai, { assert } from 'chai';
import chaiPromise from 'chai-as-promised';

chai.use(chaiPromise);

// Override DB ConnStr
const config = require('../src/server/lib/config').default;
config.sequelize.connectionString = 'sqlite://:memomry:';
config.sequelize.logging = false;
// Prevent of Hositing
const sequelize = require('../src/server/data/sequelize').default;
const { Boards, BoardPrivacySettings } = require('../src/server/data');
const UserController = require('../src/server/controllers/user').default;
const BoardController = require('../src/server/controllers/board').default;

/* globals describe, before, it */
describe('Board Controller', () => {
	let user1, user2, user3;

	before('prepare fixtures', async function (done) {
		this.timeout(0);
		try {
			await sequelize.sync({ force: true });
			user1 = await UserController.createWithLogin('test1', 'test1');
			user2 = await UserController.createWithLogin('test2', 'test2');
			user3 = await UserController.createWithLogin('test3', 'test3');
			const count = await Boards.count();
			assert.equal(count, 9);
			done();
		} catch (e) {
			done(e);
		}
	});

	describe('create()', () => {
		it('created items priority must be sequential value', async (done) => {
			try {
				const a = await BoardController.create(user1, {
					name: 'Test Board',
					isPublic: 0
				});
				const b = await BoardController.create(user1, {
					name: 'Test Board',
					isPublic: 0
				});
				const c = await BoardController.create(user1, {
					name: 'Test Board',
					isPublic: 0
				});
				assert.equal(a.BoardSorts[0].priority, 4);
				assert.equal(b.BoardSorts[0].priority, 5);
				assert.equal(c.BoardSorts[0].priority, 6);
				done();
			} catch (e) {
				done(e);
			}
		});
	});

	describe('setMode()', () => {
		it('grant read permission to another your',
			async (done) => {
				try {
					const boards = await BoardController.all(user1);
					const sharedItemId = boards.items[0].id;
					await BoardController.setMode(user1, {
						id: sharedItemId,
						rule: [{
							user: user2.PublisherId,
							mode: BoardController.Mode.READ
						}],
					});
					const canRead = await BoardController.test(
						user2,
						sharedItemId,
						BoardController.Mode.READ);
					assert(canRead);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('throws permission error when user granting permission \n'
			+ '\t which does not have ownership',
			async () => {
				const boards = await user2.getBoards();
				const chmod = BoardController.setMode(user1, {
					id: boards[0].id,
					rule: {
						user: user3.PublisherId,
						mode: BoardController.Mode.READ,
					},
				});
				return assert.isRejected(chmod, /permission error/);
			}
		);
		it('mode 0 must have to delete rule on database',
			async (done) => {
				const transaction = await sequelize.transaction();
				try {
					const boards = await user3.getBoards();
					await BoardController.setMode(user3, {
						id: boards[0].id,
						rule: {
							user: user1.PublisherId,
							mode: 4,
						},
					}, { transaction });
					const before = await BoardPrivacySettings.find({
						where: {
							BoardId: boards[0].id,
							roleId: user1.PublisherId,
						},
						transaction
					});
					assert(before !== null);
					await BoardController.setMode(user3, {
						id: boards[0].id,
						rule: {
							user: user1.PublisherId,
							mode: 0,
						},
					}, { transaction });
					const after = await BoardPrivacySettings.find({
						where: {
							BoardId: boards[0].id,
							roleId: user1.PublisherId,
						},
						transaction
					});
					assert(after === null);
					await transaction.commit();
					done();
				} catch (e) {
					await transaction.rollback();
					done(e);
				}
			}
		);
	});

	describe('all()', () => {
		it('user must have permission or ownership for all retrieved items',
			async (done) => {
				try {
					const boards = await BoardController.all(user1);
					boards.items.forEach(item => {
						assert(item.permissions.mode > 0 || item.AuthorId === user1.id);
					});
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('all retrieved items must be ordered by priority',
			async (done) => {
				try {
					const boards = await BoardController.all(user1);
					let last = 0;
					boards.items.forEach(item => {
						assert(item.priority > last);
						last = item.priority;
					});
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('all retrieved items should have to contain all those properties',
			async (done) => {
				try {
					const boards = await BoardController.all(user1);

					for (let i = 0; i < boards.items.length; ++i) {
						const item =boards.items[i];
						assert.property(item, 'AuthorId');
						assert.property(item, 'PublisherId');
						assert.property(item, 'name');
						assert.property(item, 'id');
						assert.property(item, 'priority');
						assert.property(item, 'permissions');
						assert.property(item, 'createdAt');
						assert.property(item, 'updatedAt');
					}

					assert.property(boards, 'prev');
					assert.property(boards, 'next');
					assert.property(boards, 'offset');
					assert.property(boards, 'limit');
					assert.property(boards, 'count');

					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('when retrieving at offset 0, previous value must be 0',
			async (done) => {
				try {
					const boards = await BoardController.all(user1, {
						offset: 0,
					});
					assert.equal(boards.prev, 0);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('next value must be first integer value which is bigger than\n'
			+'\t last priority values, If it contains last item.',
			async (done) => {
				try {
					const boards = await BoardController.all(user1);
					assert.equal(boards.items[5].priority, 6);
					assert.equal(boards.next, 7);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('specific number of item must be retrived If limit value provided',
			async (done) => {
				try {
					const boards = await BoardController.all(user1, {
						limit: 3,
					});
					assert.equal(boards.items.length, 3);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
	});

	describe('delete()', () => {
		it('delete board If user have ownership',
			async (done) => {
				try {
					const boards = await user1.getBoards();
					await BoardController.delete(user1, {
						id: boards[3].id
					});
					assert.ok(1);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('throws permission error when user deleting board \n'
			+ '\t which does not have ownership',
			async () => {
				const boards = await user2.getBoards();
				const deletion = BoardController.delete(user1, {
					id: boards[0].id
				});
				assert.isRejected(deletion, /permission error/);
			}
		);
	});

	describe('update()', () => {
		it('update board If user have permission',
			async (done) => {
				try {
					const boards = await user1.getBoards();
					const result = await BoardController.update(user1, {
						id: boards[0].id,
						name: 'user have write permission',
						isPublic: 1,
					});
					assert.equal(result.name, 'user have write permission');
					assert.equal(result.isPublic, true);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('throws permission error If user trying to update board\n'
			+ '\t which does not have permission',
			async () => {
				const boards = await user2.getBoards();
				const update = BoardController.update(user1, {
					id: boards[0].id,
					name: 'user not have write permission',
					isPublic: 0,
				});
				return assert.isRejected(update, /permission error/);
			}
		);
	});

	describe('sort()', () => {
		it('renumber when priority was set with redundant value',
			async function (done) {
				// this.timeout(0);
				const transaction = await sequelize.transaction();
				const t = { transaction };
				try {
					const before = await BoardController.all(user1, {}, t);
					const result = await BoardController.sort(user1, {
						id: before.items[0].id,
						value: before.items[1].priority,
					}, t);
					const after = await BoardController.all(user1, {}, t);
					assert(result.renumber);
					after.items.forEach((item, index) => {
						assert.equal(item.priority, index + 1);
					});
					transaction ? await transaction.commit() : null;
					done();
				} catch (e) {
					transaction ? await transaction.rollback() : null;
					done(e);
				}
			}
		);
		it('set new priority',
			async (done) => {
				try {
					const boards = await BoardController.all(user1);
					const result = await BoardController.sort(user1, {
						id: boards.items[0].id,
						value: 11.0,
					});
					assert(result.renumber === false);
					done();
				} catch (e) {
					done(e);
				}
			}
		);
		it('user can sort shared board which belongs to another user',
			async (done) => {
				const transaction = await sequelize.transaction();
				const t = { transaction };
				try {
					const boards = await BoardController.all(user2, {}, t);
					await BoardController.setMode(user2, {
						id: boards.items[2].id,
						rule: {
							user: user1.PublisherId,
							mode: BoardController.Mode.READ,
						},
					}, t);
					await BoardController.sort(user1, {
						id: boards.items[2].id,
						value: 11.0,
					}, t);
					await transaction.commit();
					done();
				} catch (e) {
					await transaction.rollback();
					done(e);
				}
			}
		);
		it('throws invalid parameter error if user does not have any permission',
			async () => {
				const boards = await BoardController.all(user2);
				const sort = BoardController.sort(user1, {
					id: boards.items[0].id,
					value: 11.0,
				});
				return assert.isRejected(sort, /permission error/);
			}
		);
	});

	describe('renumber()', () => {
		it('maintain sequence after renumber',
			async function (done) {
				// this.timeout(0);
				const transaction = await sequelize.transaction();
				const t = { transaction };
				try {
					const before = await BoardController.all(user1, {}, t);
					const result = await BoardController.sort(user1, {
						id: before.items[0].id,
						value: 100,
					}, t);
					await BoardController.renumber(user1, t);
					const after = await BoardController.all(user1, {}, t);
					assert(result.renumber === false);
					after.items.forEach((item, index) => {
						assert.equal(item.priority, index + 1);
					});
					const target = after.items.find(item => {
						return item.id === before.items[0].id;
					});
					assert.equal(target.priority, after.items.length);
					transaction ? await transaction.commit() : null;
					done();
				} catch (e) {
					transaction ? await transaction.rollback() : null;
					done(e);
				}
			}
		);
	});
});
