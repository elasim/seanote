//import './params.js';
import boardCtrl from '../../../controllers/board';
import listCtrl from '../../../controllers/list';
// import cardCtrl from '../../../controllers/card';

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
				BoardId: String(req.body.id),
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
				board: req.params.board
			});
		},
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
