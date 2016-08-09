import passport from 'passport';
import { OAuth2Strategy as Strategy } from 'passport-google-oauth';
import User from '../../models/user';
import router from './router';
import { loginWithPassport } from './auth-passport';
import config from '../../lib/config';

const debug = require('debug')('app.auth.google');

const googleOAuth = passport.authenticate('google', {
	scope: ['profile']
});

router.get('/google', (req, res, next) => {
	req.session.redirect = req.query.redirect;
	return googleOAuth(req, res, next);
});
router.get('/google-return', (req, res, next) => {
	loginWithPassport('google', req, res, next);
});
router.get('/google-revoke', (req, res) => {
	debug('Revoke Google Auth');
	res.status(200).end();
});

passport.use(new Strategy(
	config.auth.google,
	async (accessToken, refreshToken, profiles, done) => {
		try {
			const user = await User.getByClaim('google', profiles.id);
			if (!user) {
				const user = await User.createWithClaim(
					'google',
					profiles.id,
					{
						displayName: profiles.displayName,
						gender: getGender(profiles.gender),
					}
				);
				done(null, user);
			} else {
				done(null, user);
			}
		} catch (e) {
			debug(e);
			done(e);
		}
	}
));

function getGender(gender) {
	switch (gender) {
		case 'male': return 'Male';
		case 'female': return 'Female';
		default: return null;
	}
}
