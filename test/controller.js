/* MOCHA TEST : controller.decorator */
/* global describe, it, beforeEach, afterEach */

import 'isomorphic-fetch';
import express from 'express';
import { Controller, ActionResult } from '../src/server/controllers/controller';
import chai, { assert, expect } from 'chai';
const should = chai.should();

// @Controller()
class TestController extends Controller {
	constructor(...args) {
		super(TestController, ...args);

		this.router.param('id', (req, res, next, id) => {
			if (/^\d+$/.test(id)) {
				req.id = id;
			}
			next();
		});
	}
	get() {
		assert.isOk(true, 'GET /');
		return ActionResult.json({ result: true });
	}
	getById(id) {
		assert.match(id, /^\d+$/);
		return ActionResult.json({ result: true });
	}
	getValue(id) {
		assert.notEqual(id, 'value');
		return ActionResult.json({ result: true });
	}
	getValueById(id) {
		assert.notEqual(id, 'value');
		return ActionResult.json({ result: true });
	}
	post() {
		assert.isOk(true, 'POST /');
		return ActionResult.json({ result: true });
	}
	put() {
		assert.isOk(true, 'PUT /');
		return ActionResult.json({ result: true });
	}
	delete() {
		assert.isOk(true, 'DELETE /');
		return ActionResult.json({ result: true });
	}
}

describe('Test Controller', () => {
	let server;
	let port;
	function URL(path) {
		return 'http://127.0.0.1:' + port + path;
	}
	beforeEach(done => {
		const app = express();
		const ctrl = new TestController();
		app.use((req, res, next) => {
			console.log('Request', req.method, req.originalUrl);
			next();
		});
		app.use('/', ctrl.router);
		app.all((req, res) => {
			res.status(404).json({ error: 'not found' });
		});
		server = app.listen(5555, (e) => {
			if (e) return done(e);
			port = server.address().port;
			done();
		});
	});
	afterEach(() => {
		server.close();
	});
	describe('Auto generated routing', () => {
		it('success GET /', async () => await testRoute(URL('/'), 'GET'));
		it('success GET /value', async () => await testRoute(URL('/value'), 'GET'));
		it('success GET /0', async () => await testRoute(URL('/0'), 'GET'));
		it('success GET /0/value', async () => await testRoute(URL('/0/value'), 'GET'));
		it('success POST /', async () => await testRoute(URL('/'), 'POST'));
		it('success DELETE /', async () => await testRoute(URL('/'), 'DELETE'));
		it('success PUT /', async () => await testRoute(URL('/'), 'PUT'));
	});
});

async function testRoute(url, method, result = true) {
	try {
		const res = await fetch(url, { method: method.toUpperCase() });
		if (result === true) {
			assert(res.status === 200, 'status code is not 200');
			const data = await res.json();
			expect(data).to.have.property('result').that.is.true;
		} else {
			assert(res.status === 404, 'status code is not 404');			
		}
	} catch (e) {
		assert.isNotOk(e, e.message);
	}
}
