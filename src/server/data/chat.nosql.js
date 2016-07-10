import url from 'url';
import { odm } from '../lib/config';

configureDatabase(odm.connectionString)
	.then(db => {
	});


function configureDatabase(connStr) {
	const { protocol, host, pathname } = url.parse(connStr);
	switch (protocol) {
		case 'nedb:': {
			const isPersistence = pathname !== '/:memory:';
			return configureNeDB(isPersistence ? host + pathname : null);
		}
		case 'mongodb:': {
			return configureMongoDB(connStr);
		}
		default:
			throw new Error('unsupported protocol');
	}
}

function configureNeDB(path) {
	const DataStore = require('nedb');
	const store = new DataStore({ filename: path });
	return new Promise((resolve, reject) => {
		store.loadDatabase(e => {
			!e ? resolve(store) : reject(e);
		});
	});
}

function configureMongoDB(url) {
	const MongoClient = require('mongodb').MongoClient;
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, (err, db) => {
			!err ? resolve(db) : reject(err);
		});
	});
}
