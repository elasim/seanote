import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import express from './server/express';
import io from './server/socket.io';
import config from './config';

const httpsServer = https.createServer({
	key: fs.readFileSync(path.join(process.cwd(), './test.key')),
	cert: fs.readFileSync(path.join(process.cwd(), './test.crt')),
}, express);
httpsServer.listen(
	8443,
	config.host,
	httpsServer::onListen);

const httpServer = http.createServer(express);
httpServer.listen(
	config.port,
	config.host,
	httpServer::onListen);

io.attach(httpServer);
io.attach(httpsServer);
io.on('connection', socket => {
	console.log('New Client', `#${socket.id}`);

	socket.on('disconnect', () => {
		console.log('Client Out');
	});
});

function onListen(e) {
	if (e) {
		console.error('binding failure', e);
		return;
	}
	const addr = this.address();
	console.log(`Listening on ${addr.address}:${addr.port}`);
}
