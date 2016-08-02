import { Users } from '../../../data';

export default {
	// whoami
	get: async (req) => {
		const profile = await req.user.db.getUserProfile();
		return profile.toJSON();
	},
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
	delete: async (req) => {
		await Users.delete({
			where: {
				id: req.user.db.id
			}
		});
	}
};
