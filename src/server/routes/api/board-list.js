import { requireAuth } from './middlewares';
import { User, Board } from '../../data';

export default {
	get: [requireAuth, async (req) => {
		console.log(req.user);
		const user = await User.findById(req.user.claim.aud);
		const author = await user.getAuthor();
		// Constraints Corruption
		if (!author) {
			throw new Error('Cannot found author key for user');
		}
		const paging = {
			limit: Math.max(1, Math.min(100, req.query.limit || 10)),
			offset: Math.max(req.query.offset || 0, 0)
		};
		const where = {
			OwnerId: author.id
		};
		const items = await Board.findAll({
			where,
			attributes: ['id', 'name', 'isPublic', 'updatedAt'],
			...paging
			// 1 ~ 100 at once
		});
		const counts = await Board.count({ where });
		return {
			items: items.map(board => board.toJSON()),
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
