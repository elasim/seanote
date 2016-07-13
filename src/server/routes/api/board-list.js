import { requireAuth } from './middlewares';
import { User, Board } from '../../data';

export default {
	get: [requireAuth, async (req) => {
		const user = await User.findById(req.user.claim.aud);
		const paging = {
			limit: Math.max(1, Math.min(100, req.query.limit || 10)),
			offset: Math.max(req.query.offset || 0, 0)
		};
		const where = { OwnerId: user.AuthorId };
		const items = await Board.findAll({
			where,
			attributes: ['id', 'name', 'isPublic', 'updatedAt', 'BeforeId'],
			...paging
			// 1 ~ 100 at once
		});

		const list = items
			.reduce((ordered, current) => {
				if (current.BeforeId !== null) {
					const beforeIdx = ordered.findIndex(sortedItem => {
						return sortedItem.id === current.BeforeId;
					});
					if (beforeIdx !== -1) {
						ordered.splice(beforeIdx + 1, 0, current);
					} else {
						ordered.push(current);
					}
				} else {
					ordered.unshift(current);
				}
				return ordered;
			}, [])
			.map(item => {
				const data = item.toJSON();
				data.updatedAt = Date.parse(item.updatedAt);
				delete data.BeforeId;
				return data;
			});

		const counts = await Board.count({ where });
		return {
			items: list,
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
