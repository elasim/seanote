import user from './user';
// import { extendSessionLife } from '../../../lib/session';

export default {
	'/': {
		get(req) {
			return req.user.db.getUserProfile();
		},
	},
	'/token': {
		get: (req) => req.token,
		post: (req) => {
			// extendSessionLife();
		},
	},
	'/:user': user,
};
