import debug from 'debug';
import HttpError from '../utils/http-error';
import { requireAuth } from '../middlewares';
import { Board } from '../../../data';

const DEBUG_LOG_GET = debug('app.api.boards.get');

export default {
	get: [requireAuth, async (req) => {
		const paging = {
			limit: Math.max(1, Math.min(100, req.query.limit || 10)),
			offset: Math.max(req.query.offset || 0, 0)
		};
		// extends range to figure out prev and next priority for sorting
		const window = {
			begin: paging.offset + (paging.offset > 0 ? -1 : 0),
			size: paging.limit + (paging.offset > 0 ? 2 : 1),
		};
		const authorId = req.user.db.AuthorId;
		const where = { OwnerId: authorId };
		const boards = await Board.findAndCountAll({
			where,
			order: ['priority'],
			attributes: ['id', 'name', 'isPublic', 'updatedAt', 'priority'],
			offset: window.begin,
			limit: window.size,
		});

		DEBUG_LOG_GET('%d~%d : %d', window.begin, window.size, boards.rows.length);
		if (boards.rows.length === 0) {
			throw new HttpError('out of range', 400);
		}

		let prev;
		let next;

		const isContainHead = paging.offset === 0;
		const isReachedEnd = window.size > boards.rows.length;
		DEBUG_LOG_GET('is contain head?', isContainHead);
		DEBUG_LOG_GET('is reached end?', isReachedEnd);
		if (isContainHead) {
			// priority of head is already double(0)
			prev = .0;
		} else {
			prev = boards.rows[0].priority;
		}
		// it reached end of records
		if (isReachedEnd) {
			next = Math.floor(boards.rows[boards.rows.length - 1].priority + 1);
		} else {
			next = boards.rows[boards.rows.length - 1].priority;
		}
		if (!isContainHead) boards.rows.shift();
		if (!isReachedEnd) boards.rows.pop();

		const items = boards.rows.map(item => {
			const data = item.toJSON();
			data.updatedAt = Date.parse(item.updatedAt);
			return data;
		});
		return {
			items,
			prev,
			next,
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
