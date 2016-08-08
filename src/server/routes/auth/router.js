import { Router } from 'express';
import bodyParser from 'body-parser';
// import { User, UserLogin, UserProfile, } from '../../data';
const debug = require('debug')('app:auth');

const router = new Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
router.get('/token', (req, res) => {
	if (req.session.passport && req.session.passport.user) {
		res.json({
			token: req.session.passport.user.token
		});
	} else {
		res.status(401).json({
			error: 'invalid request'
		});
	}
});

export default router;
