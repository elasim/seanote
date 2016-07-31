//import './params.js';
import router from '../router';
import configureParams from './param';
import boardCtrl from '../../../controllers/board';
import listCtrl from '../../../controllers/list';
// import cardCtrl from '../../../controllers/card';
import HttpError from '../utils/http-error';

configureParams(router);

export default {
	'/': {
		async get(req) {
			return await boardCtrl.all(req.user.db, {
				offset: parseInt(req.query.offset, 10) || 0,
				limit: parseInt(req.query.limit, 10) || 10,
			});
		},
		async put(req) {
			return await boardCtrl.create(req.user.db, {
				name: String(req.body.name),
				isPublic: parseInt(req.body.public),
			});
		}
	},
	'/_sort': {
		async post(req) {
			return await boardCtrl.sort(req.user.db, {
				board: String(req.body.id),
				priority: parseFloat(req.body.value),
			});
		},
	},
	'/_renumber': {
		async post(req) {
			return await boardCtrl.renumber(req.user.db);
		},
	},
	'/:board': {
		async get(req) {
			return await listCtrl.all(req.user.db, {
				board: req.params.board
			});
		},
		// put: createList,
		async post(req) {
			return await boardCtrl.update(req.user.db, {
				board: req.params.board,
				name: String(req.body.name),
				isPublic: parseInt(req.body.public),
			});
		},
		async delete(req) {
			return await boardCtrl.delete(req.user.db, {
				board: req.params.board,
			});
		},
	},
	'/:board/mode': {
		async get(req) {
			const users = (req.query.users || req.user.db.PublisherId)
				.split(/,/g)
				.filter(x => x.length);
			return await boardCtrl.getMode(req.user.db, {
				board: req.params.board,
				user: users,
			});
		},
		async post(req) {
			const rules = (req.body.rules || '')
				.split(/,/g)
				.filter(x => x.length)
				.map(ruleStr => {
					const matched = ruleStr.match(/^([^:]+):([0-7])$/);
					if (!matched) {
						throw new HttpError('invalid parameter', 400);
					}
					return {
						user: matched[1],
						mode: parseInt(matched[2], 10),
					};
				});
			return await boardCtrl.setMode(req.user.db, {
				board: req.params.board,
				rule: rules,
			});
		}
	},
	// '/:board/_sort': {
	// 	post: sortLists,
	// },
	// '/:board/_renumber': {
	// 	post: renumberLists,
	// },
	// '/:list': {
	// 	get: getCards,
	// 	put: createCard,
	// 	post: updateList,
	// 	delete: deleteList,
	// },
	// '/:list/_sort': {
	// 	post: sortCards,
	// },
	// '/:list/_renumber': {
	// 	post: renumberCards,
	// },
	// '/:card': {
	// 	get: getCardInfo,
	// 	post: updateCard,
	// 	delete: deleteCard,
	// },
	// '/sort': sort,
	// '/list/:list': list,
	// '/card/:card': card,
};
