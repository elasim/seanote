import { User } from '../../data';

export default {
	// whoami
	get(req, res) {
		if (!req.user) {
			res.json({ token: null });
		} else {
			res.json({ token: req.session.passport.user.token });
		}
	},
	/*
	put(req, res) {}
	post(req, res) {}
	delete(req, res) {}
	*/
};
