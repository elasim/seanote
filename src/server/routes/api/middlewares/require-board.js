import debug from 'debug';
import { Author, Board, Group } from '../../../data';
import HttpError from '../utils/http-error';

const DEBUG_LOG_REQUIRE_BOARD = debug('app.api.middleware.requireBoard');

export default async function requireBoard(req, res, next) {
	try {
		DEBUG_LOG_REQUIRE_BOARD('params', req.params);
		const board = await Board.findById(req.params.board, {
			attributes: ['id', 'updatedAt', 'createdAt'],
			include: [{ model: Author, as: 'Owner'}]
		});
		if (!board) {
			return next(new HttpError('invald id', 404));
		}
		if (!board.isPublic) {
			DEBUG_LOG_REQUIRE_BOARD('%s is not Public', req.params.board);
			DEBUG_LOG_REQUIRE_BOARD('Owner id %s', board.Owner.id);
			DEBUG_LOG_REQUIRE_BOARD('Author id %s', req.user.db.AuthorId);
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
				if (!await group.hasUsers([req.user.claim.aud])) {
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
