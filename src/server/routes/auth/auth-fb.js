import passport from 'passport';
import { Strategy } from 'passport-facebook';
import UserController from '../../controllers/user';
import router from './router';
import { loginWithPassport } from './auth-passport';
import config from '../../lib/config';

const debug = require('debug')('app.auth.fb');

router.get('/fb', passport.authenticate('facebook', {
	scope: ['public_profile', 'email'],
}));
router.get('/fb-return', (req, res, next) => {
	loginWithPassport('facebook', req, res, next);
});
router.get('/fb-revoke', (req, res) => {
	debug('revoke');
	res.status(200).end();
});

passport.use(new Strategy(
	config.auth.facebook,
	async (accessToken, refreshToken, profiles, done) => {
		try {
			const user = await UserController.getByClaim('facebook', profiles.id);
			if (!user) {
				debug('create new user with facebook claim: ', profiles.id);
				const user = await UserController.createWithClaim(
					'facebook',
					profiles.id,
					{
						displayName: profiles.displayName,
						// parse public-profiles and email
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
