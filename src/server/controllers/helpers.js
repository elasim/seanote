import sequelize from '../data/sequelize';

const debug = require('debug')('app.controllers.helper');

export function commit(t, opt) {
	return opt.transaction ? null : t.commit();
}

export function rollback(t, opt) {
	return opt.transaction ? null : t.rollback();
}

export function beginTransaction(opt) {
	debug(opt.transaction
		? 'use extern transaction' : 'use internal transaction');
	return opt.transaction || sequelize.transaction();
}
