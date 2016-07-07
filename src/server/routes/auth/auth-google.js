import passport from 'passport';
import { OAuth2Strategy as Strategy } from 'passport-google-oauth';
import { User, UserClaim } from '../../data';
import router from './router';
import { loginWithPassport } from './auth-passport';
import { auth as AuthCfg } from '../../../config';

const googleOAuth = passport.authenticate('google', {
	scope: ['profile']
});

router.use((req, res, next) => {
	console.log(req.method, req.originalUrl, req.body);
	next();
});
router.get('/google', (req, res, next) => {
	req.session.redirect = req.query.redirect;
	return googleOAuth(req, res, next);
});
router.get('/google-return', (req, res, next) => {
	loginWithPassport('google', req, res, next);
});
router.get('/google-revoke', (req, res) => {
	console.log('Revoke Google Auth');
	res.status(200).end();
});

passport.use(new Strategy(
	AuthCfg.google,
	async (accessToken, refreshToken, profile, done) => {
		try {
			const claim = await UserClaim.findOne({
				where: {
					provider: 'google',
					id: profile.id,
				}
			});
			if (!claim) {
				const user = await User.createWithClaim('google', profile.id, {
					displayName: profile.displayName,
					gender: getGender(profile.gender),
				});
				done(null, user);
			} else {
				const user = await claim.getUser();
				done(null, user);
			}
		} catch (e) {
			console.log('Error', e);
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
