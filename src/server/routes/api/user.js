import { User } from '../../data';

export default {
	// whoami
	get: [(req, res, next) => {
		if (!req.user) return next(new Error('authorized only'));
		next();
	}, (req) => {
		return Promise.resolve({ token: req.session.passport.user.token });
	}],
	/*
	put(req, res) {}
	post(req, res) {}
	delete(req, res) {}
	*/
};
