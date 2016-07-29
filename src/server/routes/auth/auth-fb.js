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
	async (accessToken, refreshToken, profile, done) => {
		try {
			const user = await UserController.getByClaim({
				provider: 'facebook',
				id: profile.id,
			});
			if (!user) {
				debug('create new user with facebook claim: ', profile.id);
				const user = await UserController.createWithClaim(
					'facebook',
					profile.id,
					{
						displayName: profile.displayName,
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
