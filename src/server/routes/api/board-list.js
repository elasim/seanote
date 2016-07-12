import { requireAuth } from './middlewares';
import { User, Board } from '../../data';

export default {
	get: [requireAuth, async (req) => {
		const user = await User.findById(req.user.claim.aud);
		const paging = {
			limit: Math.max(1, Math.min(100, req.query.limit || 10)),
			offset: Math.max(req.query.offset || 0, 0)
		};
		const where = {
			OwnerId: user.AuthorId
		};
		const items = await Board.findAll({
			where,
			attributes: ['id', 'name', 'isPublic', 'updatedAt'],
			...paging
			// 1 ~ 100 at once
		});
		const counts = await Board.count({ where });
		return {
			items: items.map(board => {
				const data = board.toJSON();
				data.updatedAt = Date.parse(board.updatedAt);
				return data;
			}),
			counts,
			...paging,
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
