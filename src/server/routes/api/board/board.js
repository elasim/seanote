import { requireAuth, requireBoard } from '../middlewares';
import { List, Card } from '../../../data';

export default {
	get: [requireAuth, requireBoard, async (req) => {
		const lists = await List.findAll({
			attributes: { exclude: ['BoardId'] },
			where: { BoardId: req.board.id },
			include: [{
				model: Card,
				attributes: { exclude: ['ListId'] },
			}],
			order: ['List.priority', 'Cards.priority'],
		});
		const items = lists.map(item => item.toJSON());
		return { id: req.board.id, items };
	}],
	post: [requireAuth, requireBoard, async (req) => {
		const { name, isPublic, priority } = req.body;

		if (name) req.board.name = name;
		if (isPublic) req.board.isPublic = isPublic;
		if (priority) req.board.priority = priority;

		const withoutTimestamp = isUndef(name) && isUndef(isPublic);

		return await req.board.save({
			silent: withoutTimestamp,
		});
	}],
	/*
	put(req, res) {

	},
	delete(req, res) {

	},
	*/
};

function isUndef(val) {
	return typeof val === 'undefined';
}
