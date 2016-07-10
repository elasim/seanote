import passport from 'passport';
import { Strategy } from 'passport-facebook';
import { User, UserClaim } from '../../data';
import router from './router';
import { loginWithPassport } from './auth-passport';
import config from '../../lib/config';

router.get('/fb', passport.authenticate('facebook', {
	scope: ['public_profile', 'email'],
}));
router.get('/fb-return', (req, res, next) => {
	loginWithPassport('facebook', req, res, next);
});
router.get('/fb-revoke', (req, res) => {
	console.log('Revoke');
	res.status(200).end();
});

passport.use(new Strategy(
	config.auth.facebook,
	async (accessToken, refreshToken, profile, done) => {
		try {
			const claim = await UserClaim.findOne({
				where: {
					provider: 'facebook',
					id: profile.id
				}
			});
			if (!claim) {
				const user = await User.createWithClaim('facebook', profile.id, {
					displayName: profile.displayName,
					// parse public-profiles and email
				});
				done(null, user);
			} else {
				const user = await claim.getUser();
				done(null, user);
			}
		} catch (e) {
			done(e);
		}
	}
));
