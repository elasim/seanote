import path from 'path';
import express from 'express';
import helmet from 'helmet';
import { engine } from './lib/simple-template';
import routes from './routes';

const assetDebugView = require('../views/without-template.html');

const debugViewPath = path.join(__dirname, assetDebugView);
const viewsDir = path.join(__dirname, './views');

const app = express();

app.engine('html', engine);
app.set('views', viewsDir);
app.set('view engine', 'html');

app.use(helmet());
app.use(routes);

app.get('/favicon.ico', (req, res) => res.status(404).end());
app.use('/assets', express.static(path.join(__dirname, './assets')));
//app.get('/assets/bundle.js', (req, res) => res.sendFile(path.join(__dirname, './client.js')));
if (0) {
	app.get('*', require('./react-ssr').default);
} else {
	app.get('*', (req, res) => res.sendFile(debugViewPath));
}

export default app;
