import { requireAuth } from '../middlewares';
import { beginTransaction, Board, List, Card, Author, Group } from '../../../data';
import HttpError from '../utils/http-error';
import { sortLinkedList } from '../utils/sort';

export default {
	get: [requireAuth, parseBoardParam, async (req) => {
		const lists = await List.findAll({
			attributes: { exclude: ['BoardId'] },
			where: { BoardId: req.board.id },
			include: [{
				model: Card,
				attributes: { exclude: ['ListId'] },
			}]
		});
		const items = sortLinkedList(lists).map(list => {
			const data = {
				...list.toJSON(),
				Cards: sortLinkedList(list.Cards).map(card => {
					const data = card.toJSON();
					delete data.BeforeId;
					return data;
				}),
			};
			delete data.BeforeId;
			return data;
		});
		return { items };
	}],
	post: [requireAuth, parseBoardParam, async (req) => {
		const { name, isPublic, BeforeId } = req.body;
		if (name) req.board.name = name;
		if (isPublic) req.board.isPublic = isPublic;

		if (BeforeId) {
			const t = { transaction: await beginTransaction() };
			try {
				const next = await Board.findOne({
					where: { BeforeId: req.board.id }
				}, t);
				next.BeforeId = req.board.BeforeId;
				await Promise.all([
					next.save(t),
					req.board.save(t)
				]);
				await t.commit();
			} catch (e) {
				await t.transaction.rollback();
				throw e;
			}
		} else {
			await req.board.save();
		}
	}],
	/*
	put(req, res) {

	},
	delete(req, res) {

	},
	*/
};

async function parseBoardParam(req, res, next) {
	try {
		const board = await Board.findById(req.params.board, {
			attributes: ['id', 'updatedAt', 'createdAt'],
			include: [{ model: Author, as: 'Owner'}]
		});
		if (!board) {
			return next(new HttpError('invald id', 404));
		}
		if (!board.isPublic) {
			if (req.user.db.AuthorId !== board.Owner.id) {
				return next(new HttpError('forbidden', 403));
			} else {
				req.board = board;
				return next();
			}
		}
		switch (board.Owner.type) {
			case 'group': {
				const group = await Group.findOne({
					where: {
						AuthorId: board.OwnerId
					}
				});
				if (!group) {
					return next(new Error('cannot found author information'));
				}
				if (!await group.hasUsers([req.user.id])) {
					return next(new Error('permission denied'));
				}
				return next(new Error('not implemented'));
			}
			case 'user': {
				return next(new HttpError('Not Implemented', 500));
			}
		}
		req.board = board;
		next();
	} catch (e) {
		return next(e);
	}
}
