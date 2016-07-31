import passport from 'passport';
import { Strategy } from 'passport-local';
import UserController from '../../controllers/user';
import router from './router';
import { loginWithPassport } from './auth-passport';

const debug = require('debug')('app.auth.local');

router.post('/local', (req, res, next) => {
	debug('post request');
	return loginWithPassport('local', req, res, next);
});

passport.use(new Strategy({
	usernameField: 'email',
	passwordField: 'password',
}, async (email, password, done) => {
	try {
		// I used email as login name for local-strategy
		const user = await UserController.getByLogin(email.trim(), password);
		if (!user) {
			const user = await UserController.createWithLogin(email.trim(), password);
			done(null, user);
		} else {
			done(null, user);
		}
	} catch (e) {
		debug(e);
		done(e);
	}
}));
