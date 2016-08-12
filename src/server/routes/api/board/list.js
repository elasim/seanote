import List from '../../../models/list';
import isUndefined from 'lodash/isUndefined';
import isNaN from 'lodash/isNaN';
import { assignWith, $not, $select, $selects } from '../utils/functional';

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
		post: sort,
		patch: sort,
	}
};

const selectId = $select({
	id: o => o.params.list
});
const selectBoard = $select({
	board: o => o.params.board,
});
const selectBoardAndId = $selects(selectId, selectBoard);

function findAll(req) {
	return List.all(req.user.db, selectBoard(req));
}

function create(req) {
	return List.create(req.user.db, {
		...selectBoard(req),
		name: req.body.name,
	});
}

function renumber(req) {
	return List.renumber(req.user.db, selectBoard(req));
}

function get(req) {
	return List.get(req.user.db, selectBoardAndId(req));
}

function update(req) {
	const params = selectBoardAndId(req);
	assignWith(params, 'name', req.body.name, $not(isUndefined));
	assignWith(params, 'isClose', parseInt(req.body.close), $not(isNaN));
// 	assignWith(params, 'priority', parseFloat(req.body.priority), $not(isNaN));
	return List.update(req.user.db, params);
}

function delete_(req) {
	return List.delete(req.user.db, selectBoardAndId(req));
}

function sort(req) {
	return List.sort(req.user.db, {
		...selectBoardAndId(req),
		value: parseFloat(req.body.value),
	});
}
