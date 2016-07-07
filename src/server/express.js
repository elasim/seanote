import path from 'path';
import express from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import passport from 'passport';
import { extendSession } from './lib/auth';
import { engine } from './lib/simple-template';
import routes from './routes';

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
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	if (req.user) {
		if (extendSession(req.user)) {
			console.log(req.user.ssid, ': Token expirey extended');
		} else {
			console.log(req.user.ssid, ': Token expired');
			req.session = null;
		}
	}
	return next();
});
app.use(routes);

app.get('/favicon.ico', (req, res) => res.status(404).end());
app.get(assets.main.js, (req, res) => res.sendFile(bundlePath));
if (0) {
	app.get('*', require('./react-ssr').default);
} else {
	app.get('*', (req, res) => res.sendFile(debugViewPath));
}

export default app;
