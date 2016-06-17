import express from 'express';
import path from 'path';
import assets from './assets';
import config from './config';

import index from './html/index.html';

const app = express();

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, index));
});
app.get(assets.main.js, (req, res) => {
	res.sendFile(path.join(__dirname, assets.main.js));
});

const http = app.listen(config.port, config.host, e => {
	if (e) {
		console.error('Binding error', e);
		return;
	}
	const addr = http.address();
	console.log('Server Listening on '+addr.address+':'+addr.port);
});
