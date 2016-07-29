import passport from 'passport';
import { Strategy } from 'passport-local';
import UserController from '../../controllers/user';
import router from './router';
import { loginWithPassport } from './auth-passport';

// local login have 2 scenarios
// 1st is API call with accept headers
// 2nd is usual form submit
router.post('/signin', (req, res, next) => {
	if (req.callingAPI) {
		passport.authenticate('local', (e, user, info) => {
			if (e) return res.status(401).json({ error: e.message });
			if (!user) return res.status(403).end();
			req.login(user, e => {
				if (e) return next(e);
				return res.status(200).end();
			});
		})(req, res, next);
	} else {
		req.session.redirect = req.query.redirect;
		loginWithPassport('local', req, res, next);
	}
});

passport.use(new Strategy({
	usernameField: 'email',
	passwordField: 'password',
}, async (email, password, done) => {
	try {
		// I used email as login name for local-strategy
		const user = await UserController.getByLogin(email.trim(), password);
		if (!user) return done(new Error('Invalid Email or Password'));
		done(null, user);
	} catch (e) {
		done(e);
	}
}));
