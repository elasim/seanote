import express from 'express';
import path from 'path';

const app = express();

app.get('/', (req, res) => {
	res.sendFile('./index.html', {
		root: path.join(process.cwd(), './src')
	});
});

const http = app.listen(8000, '0.0.0.0', e => {
	if (e) {
		console.error('Binding error', e);
		return;
	}
	const addr = http.address();
	console.log('Server Listening on '+addr.address+':'+addr.port);
});
