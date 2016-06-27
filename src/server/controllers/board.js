import { Router } from 'express';
import { Controller, ActionResult } from './controller';
import { Author, Board } from '../models/board';
import ListController from './list';

export default class BoardController extends Controller {
	constructor(...args) {
		super(...args);

		const listCtrl = new ListController();

		this.router.ues('/list', listCtrl.router);
	}
	/** enumerate boards */
	async get(query) {
		console.log('request all');
		const pages = {
			limit: Math.min(parseInt(query.limit, 10), 50),
			offset: Math.max(parseInt(query.offset, 10), 0),
		};
		try {
			const data = await Board.findAll(pages);
			return ActionResult.json({
				result: data
			});
		} catch (e) {
			return ActionResult.json({
				error: e.message
			});
		}
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
	/** get author data */
	getAuthorById(id) {

	}
	/** get list 
}
