import { Router } from 'express';
import auth from './auth';
import api from './api';

const router = new Router();

router.use('/api', api);
router.use('/auth', auth);

router.get('/signin', redirectToDashboard);
router.get('/setting', redirectToSignIn);
router.get('/boards', redirectToSignIn);
router.get('/boards/:id', redirectToSignIn);
router.all('/logout', redirectToSignIn, (req, res) => {
	req.session = null;
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
