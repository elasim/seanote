import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import express from './express';
import config from './lib/config';

const httpsServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, config.https.key)),
	cert: fs.readFileSync(path.join(__dirname, config.https.cert)),
}, express);
httpsServer.listen(
	config.https.port,
	config.host,
	httpsServer::onListen);

const httpServer = http.createServer(express);
httpServer.listen(
	config.port,
	config.host,
	httpServer::onListen);

function onListen(e) {
	if (e) {
		console.error('binding failure', e);
		return;
	}
	const addr = this.address();
	console.log(`Listen on! ${addr.address}:${addr.port}`);
}
