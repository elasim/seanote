import path from 'path';
import express from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import passport from 'passport';
import { engine } from './lib/simple-template';
import { connectJwtSession } from './lib/session';
import routes from './routes';

const assetDebugView = require('../views/without-template.html');

const debugViewPath = path.join(__dirname, assetDebugView);
const viewsDir = path.join(__dirname, './views');

const app = express();

app.engine('html', engine);
app.set('views', viewsDir);
app.set('view engine', 'html');

app.use(helmet());
app.use(cookieSession({	name: 'sid', keys: ['key'] }));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectJwtSession);
app.use(routes);

app.get('/favicon.ico', (req, res) => res.status(404).end());
app.use('/assets', express.static(path.join(__dirname, './assets')));
//app.get('/assets/bundle.js', (req, res) => res.sendFile(path.join(__dirname, './client.js')));
if (1) {
	app.get('*', require('./react-ssr').default);
} else {
	app.get('*', (req, res) => res.sendFile(debugViewPath));
}

export default app;
