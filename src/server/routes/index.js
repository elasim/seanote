import { Router } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { connectJwtSession } from '../lib/session';
import auth from './auth';
import api from './api';

const debug = require('debug')('app.route');
const router = new Router();

router.use('/api', api);

router.use(cookieSession({	name: 'sid', keys: ['key'] }));
router.use(passport.initialize());
router.use(passport.session());
router.use(connectJwtSession);
router.use('/auth', auth);
router.get('/signin', redirectToDashboard);
router.get('/setting', redirectToSignIn);
router.get('/boards', redirectToSignIn);
router.get('/boards/:id', redirectToSignIn);
router.get('/logout', redirectToSignIn, (req, res) => {
	req.logout();
	res.redirect('/');
});

function redirectToDashboard(req, res, next) {
	if (req.user) return res.redirect('/');
	next();
}

function redirectToSignIn(req, res, next) {
	if (!req.session || !req.user) {
		const redirect = encodeURIComponent(req.originalUrl);
		return res.redirect(`/signin?redirect=${redirect}`);
	}
	next();
}

export default router;
