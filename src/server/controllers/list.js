import Sequelize from 'sequelize';
import Validator from 'validator';
import validate from './validation';
import { Lists } from '../data/schema/list';
import { Cards } from '../data/schema/card';
import { BoardSorts } from '../data/schema/board';
import sequelize from '../data/sequelize';
import boardCtrl from './board';

const debug = require('debug')('app.ListController');

export default new class ListController {
	async renumber(user, { board }) {
		debug('renumber(): %s %s', board, typeof board, );
		await validate(boardCtrl.havePermission, user, board, boardCtrl.Mode.READ);
	}
	async all(user, { board }) {
		debug('all(): %s %s', board, typeof board);
		await validate(boardCtrl.havePermission, user, board, boardCtrl.Mode.READ);
		const lists = await Lists.findAll({
			where: { BoardId: board },
			include: [Cards],
			order: ['List.priority', 'Cards.priority']
		});
		return {
			id: board,
			items: lists,
		};
	}
};
