import { Router } from 'express';
import { List } from '../models/board';

import { Controller } from './controller';

export default class ListController extends Controller {
	constructor(...args) {
		super(...args);
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
