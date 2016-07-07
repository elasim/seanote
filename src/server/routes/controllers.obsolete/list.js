import { Controller } from './controller';
import { List } from '../../data';

export default class ListController extends Controller {
	constructor(...args) {
		super(ListController, ...args);

		List.sync();
	}
	/** enumerate boards */
	get() {
	}
	/** create new board */
	put() {
	}
	/** update board data */
	postWithId(id, req, res) {

	}
	/** delete exists board */
	deleteById(id) {
	
	}
}
