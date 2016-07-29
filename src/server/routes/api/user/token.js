import { requireAuth } from '../middlewares';

export default {
	get: [requireAuth, req => {
		return Promise.resolve({
			token: req.session.passport.user.token
		});
	}],
};
