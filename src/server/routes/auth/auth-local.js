import passport from 'passport';
import { Strategy } from 'passport-local';
import { UserLogin } from '../../data';
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
		const login = await UserLogin.findOne({
			where: {
				uesrname: email.trim(),
				password,
			},
		});
		if (!login) return done(new Error('Invalid Email or Password'));
		const user = await login.getUser();
		done(null, user);
	} catch (e) {
		done(e);
	}
}));
