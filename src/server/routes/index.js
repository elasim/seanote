import { Router } from 'express';
import auth from './auth';
import api from './api';

const router = new Router();

router.use('/auth', auth);
router.all('/logout', (req, res) => {
	if (req.session) {
		req.session = null;
	}
	res.redirect('/');
});
router.use('/api', api);

router.get('/signin', redirectToDashboard);
router.get('/setting', redirectToSignIn);
router.get('/pages', redirectToSignIn);
router.get('/pages/:id', redirectToSignIn);

function redirectToDashboard(req, res, next) {
	if (req.user) return res.redirect('/');
	next();
}

function redirectToSignIn(req, res, next) {
	if (!req.user) {
		const redirect = encodeURIComponent(req.originalUrl);
		return res.redirect(`/signin?redirect=${redirect}`);
	}
	next();
}

export default router;
