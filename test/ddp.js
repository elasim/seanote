import DDPClient from '../src/common/lib/ddp/client';
import DDPServer from '../src/common/lib/ddp/server';
import DDP from '../src/common/lib/ddp/common';
import SocketIO from 'socket.io';
import SocketIOClient from 'socket.io-client';
import Sequelize from 'sequelize';

import { assert, expect, should as ShouldGenerator } from 'chai';
const should = ShouldGenerator();

const sequelize = new Sequelize('test', null, null, {
	dialect: 'sqlite',
	logging: false,
});
/* globals describe, it, afterEach, beforeEach, before, after */
describe('DDP', () => {
	let ioServer;
	let PublicDataModel;
	let ddp;
	beforeEach(async () => {
		const ioServer = SocketIO(9999);
		let numClients = 0;
		ioServer.on('connection', (sock) => {
			numClients++;
			console.log(numClients, 'Connection');

			sock.on('disconnect', () => {
				numClients--;
				console.log(numClients, 'Connection');
			});
		});
		ddp = new DDPServer(ioServer.of('_ddp'));

		PublicDataModel = sequelize.define('Public', {
			pid: { type: Sequelize.UUID, primaryKey: true },
			value: Sequelize.STRING,
		});
		await PublicDataModel.sync({ force: true });

		for (let i = 0; i < 32; ++i) {
			await PublicDataModel.create({
				value: Math.random().toString(36).substr(2),
			});
		}
		ddp.model('PublicData').connect(DDP.SequelizeAdapter(PublicDataModel));
	});
	afterEach(async () => {
		await PublicDataModel.drop();
		ioServer.close();
	});
	before(() => {
		// ddp.use(rbac);
		// const adminRole = rbac.createRole('admin');
		// const userRole = rbac.createRole('user');
		// const guestRole = rbac.createRole('guest');
		// rbac.setDefaultRole('guest');
		// const PublicData = ddp.model('public_data');
		// PublicData.use(PublicDataModel);
		// const SecureData = ddp.model('secure_data');
		// SecureData.use(SecureDataModel);
		// SecureData.use(rbac.rules({
		// 	'admin': true,
		// 	'user': {
		// 		'create': false,
		// 		'read': true,
		// 		'delete': false,
		// 		'update': true,
		// 	},
		// 	'guest': false,
		// }));
		// SecureData.use(rbac.read.grant({
		// 	user: [],
		// 	default: () => false,
		// }));
		// SecureData.use(rbac.delete.filter({
		// 	user: (key, value) => value !== 'locked',
		// }));
	});
	after(() => {
		// placeholder
	});

	it('using undefined model must be failed', () => {
		const client = new DDPClient('ws://127.0.0.1:9999');
		expect(async () => {
			const UnknownModel = client.model('Unknown');
			try {
				await UnknownModel.findAll();
				client.disconnect();
			} catch (e) {
				client.disconnect();
			}
		}).to.throw(/Unknown Model/);
	});

	it('non-auth data access and syncing', async () => {
		const client = new DDPClient('ws://127.0.0.1:9999');
		const PublicDataModel = client.model('PublicData');
		const rows = await PublicDataModel.findAll();

		expect(rows).to.have.property('count')
			.that.is.an('number')
			.that.is(32);
		client.disconnect();
	});
});
