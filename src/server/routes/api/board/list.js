import ListController from '../../../controllers/list';
import isUndefined from 'lodash/isUndefined';
import isNaN from 'lodash/isNaN';
import { assignWith, $not, $select } from '../utils/functional';

export default {
	'/': {
		get: findAll,
		put: create,
	},
	'/_renumber': {
		post: renumber,
	},
	'/:list': {
		get: get,
		post: update,
		patch: update,
		delete: delete_,
	},
	'/:list/_sort': {
		post: sort
	}
};

const selectBoard = $select({
	board: o => o.params.board,
});
const selectBoardAndId = $select({
	board: o => o.params.board,
	id: o => o.params.list,
});

async function findAll(req) {
	return ListController.all(req.user.db, selectBoard(req));
}

async function create(req) {
	return ListController.create(req.user.db, {
		...selectBoard(req),
		name: req.body.name,
	});
}

async function renumber(req) {
	return ListController.renumber(req.user.db, selectBoard(req));
}

async function get(req) {
	return ListController.get(req.user.db, selectBoardAndId(req));
}

async function update(req) {
	const params = selectBoardAndId(req);
	assignWith(params, 'name', req.body.name, $not(isUndefined));
	assignWith(params, 'isClose', parseInt(req.body.close), $not(isNaN));
// 	assignWith(params, 'priority', parseFloat(req.body.priority), $not(isNaN));
	return ListController.update(req.user.db, params);
}

async function delete_(req) {
	return ListController.delete(req.user.db, selectBoardAndId(req));
}

async function sort(req) {
	return ListController.sort(req.user.db, {
		...selectBoardAndId(req),
		value: parseFloat(req.body.value),
	});
}
