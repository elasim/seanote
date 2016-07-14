import debug from 'debug';
import { requireAuth } from '../middlewares';
import { Board } from '../../../data';
import { sortLinkedList } from '../utils/sort';
import { createTimeoutCache } from '../utils/cache';

const cachedSortingData = {};

const DEBUG_SORT = debug('app.api.board.internal.sort');

async function sort(rows, authorId) {
	if (!cachedSortingData[authorId]) {
		DEBUG_SORT('%s : cache miss', authorId);
		const all = await Board.findAll({
			where: { OwnerId: authorId },
			attributes: ['id', 'BeforeId']
		});
		const orderedList = sortLinkedList(all);
		const indices = Object.assign(...orderedList.map(
			(row, index) => ({ [row.id]: index })
		));
		createTimeoutCache(cachedSortingData, authorId, indices, 60 * 1000);
		DEBUG_SORT('%s : cache generated', authorId);
	} else {
		DEBUG_SORT('%s : cache hit', authorId);
		cachedSortingData[authorId].hit();
	}
	const indices = cachedSortingData[authorId].value;
	return rows.sort((lhs, rhs) => {
		return indices[lhs.id] > indices[rhs.id];
	});
}

export default {
	get: [requireAuth, async (req) => {
		const paging = {
			limit: Math.max(1, Math.min(100, req.query.limit || 10)),
			offset: Math.max(req.query.offset || 0, 0)
		};
		const authorId = req.user.db.AuthorId;
		const where = { OwnerId: authorId };
		const boards = await Board.findAndCountAll({
			where,
			attributes: ['id', 'name', 'isPublic', 'updatedAt', 'BeforeId'],
			...paging
		});
		const list = await sort(boards.rows, authorId);
		const items = list.map(item => {
			const data = item.toJSON();
			data.updatedAt = Date.parse(item.updatedAt);
			delete data.BeforeId;
			return data;
		});
		return {
			items,
			counts: boards.count,
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
