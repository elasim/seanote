import { requireAuth } from '../middlewares';
import { Users } from '../../../data';

export default {
	// whoami
	get: [requireAuth, async (req) => {
		const profile = await req.user.db.getUserProfile();
		return profile.toJSON();
	}],
	// put: [requireAuth, async (req) => {
	// 	req.
	// }],
	post(req, res) {
		const {
			name,
			picture,
			email,
			compnay,
			website,
			location,
			gender,
		} = res.body;
	},
	delete: [requireAuth, async (req) => {
		await Users.delete({
			where: {
				id: req.user.db.id
			}
		});
	}]
};
