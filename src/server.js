import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import express from './server/express';
import config from './config';

const httpsServer = https.createServer({
	key: fs.readFileSync(path.join(process.cwd(), config.https.key)),
	cert: fs.readFileSync(path.join(process.cwd(), config.https.cert)),
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
	console.log(`Listening on ${addr.address}:${addr.port}`);
}
