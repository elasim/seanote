import { requireAuth } from '../middlewares';
import { User, Board } from '../../../data';

export default {
	get: [requireAuth, async (req) => {
		const user = await User.findById(req.user.claim.aud);
		const paging = {
			limit: Math.max(1, Math.min(100, req.query.limit || 10)),
			offset: Math.max(req.query.offset || 0, 0)
		};
	}],
	/*
	put(req, res) {

	},
	post(req, res) {

	},
	delete(req, res) {

	},
	*/
};
