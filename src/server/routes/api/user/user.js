import { requireAuth } from '../middlewares';

export default {
	// whoami
	get: [requireAuth, (req) => {
		return Promise.resolve({ token: req.session.passport.user.token });
	}],
	/*
	put(req, res) {}
	post(req, res) {}
	delete(req, res) {}
	*/
};
