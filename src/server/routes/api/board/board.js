import { requireAuth } from '../middlewares';
import { User, Board, Author } from '../../../data';

export default {
	//get: [requireAuth, async (req) => {
	get: [parseBoardParam, async (req) => {
		return {
			data: req.board
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

async function parseBoardParam(req, res, next) {
	console.log('parse board param');
	const board = await Board.findById(req.params.board, {
		include: [Author]
	});
	console.log(board);
	if (!board) {
		return next(new Error('invald id'));
	}
	req.board = board.toJSON();
	next();
}
