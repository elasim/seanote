import { Controller, ActionResult } from './controller';
import { Board } from '../../data';

export default class BoardController extends Controller {
	constructor(...args) {
		super(BoardController, ...args);

		Board.sync();
	}
	/** enumerate boards */
	get(query) {
		const pages = {
			limit: Math.min(parseInt(query.limit || 10, 10), 50),
			offset: Math.max(parseInt(query.offset || 10, 10), 0),
		};
		return Board.findAll(pages)
			.then(data => ActionResult.json({ result: data }))
			.catch(e => ActionResult.json({ error: e.message }));
	}
	/** create new board */
	put(query, body) {
		return ActionResult.json({ query, body });
	}
	/** update board data */
	postWithId(id, req, res) {

	}
	/** delete exists board */
	deleteById(id) {
	
	}
	/** get author data */
	getAuthorById(id) {

	}
	/** get list */
}
