import path from 'path';
import express from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import { engine } from './lib/simple-template';
import { ddpVerifyToken } from './lib/ddp-middleware';
import routesAPI from './routes/api';

const assets = require('./assets');
const assetDebugView = require('../views/without-template.html');

const debugViewPath = path.join(__dirname, assetDebugView);
const viewsDir = path.join(__dirname, './views');
const bundlePath = path.join(__dirname, assets.main.js);

const app = express();

app.engine('html', engine);
app.set('views', viewsDir);
app.set('view engine', 'html');

app.use(helmet());
app.use(cookieSession({	name: 'sid', keys: ['key'] }));
app.use('/api', routesAPI);

app.get('/favicon.ico', (req, res) => res.status(404).end());
app.get(assets.main.js, (req, res) => res.sendFile(bundlePath));

if (0) {
	app.get('*', require('./react-router-ssr').default);
} else {
	app.get('*', (req, res) => res.sendFile(debugViewPath));
}

export default app;
