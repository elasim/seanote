import { Router } from 'express';
import { User } from '../../data';

const router = new Router();

// Return current user info, same as whoami command on unix
router.get('/', (req, res) => {
	if (!req.user) {
		res.json({ token: null });
	} else {
		res.json({ token: req.session.passport.user.token });
	}
});

export default router;
