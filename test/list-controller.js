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
const ListController = require('../src/server/controllers/list').default;
const BoardController = require('../src/server/controllers/board').default;

/* globals describe, before, it */
describe('ListController', () => {
	let user;
	before('prepare data',
		async (done) => {
			try {
				await sequelize.sync({ force: true });
				user = await UserController.createWithLogin(
					'test@test',
					'testpass');
				done();
			} catch (e) {
				done(e);
			}
		}
	);

	describe('all()', () => {
		it('retrieve all lists which belongs to board', async (done) => {
			try {
				const boards = await BoardController.all(user, []);
				const lists = await ListController.all(user, {
					board: boards.items[0].id
				});
				assert(lists.items.length === 2);
				done();
			} catch (e) {
				done(e);
			}
		});
		it('result must be sorted by priority', async (done) => {
			try {
				const boards = await BoardController.all(user, []);
				const lists = await ListController.all(user, {
					board: boards.items[0].id
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
	});

});
