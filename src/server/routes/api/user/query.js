import { requireAuth } from '../middlewares';

export default {
	get: [requireAuth, async req => {
		const profile = await req.user.db.getUserProfile();
		return {
			me: profile,
		};
	}],
};
