import Card from '../../../models/card';
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
	'/:card': {
		get: get,
		post: update,
		patch: update,
		delete: delete_,
	},
	'/:card/_sort': {
		post: sort
	}
};

const selectId = $select({
	id: o => o.params.card,
});
const selectList = $select({
	list: o => o.parmas.list,
});
const selectListAndId = $selects(selectId, selectList);

function findAll(req) {
	return Card.all(req.user.db, selectList(req));
}

function create(req) {
	return Card.create(req.user.db, {
		...selectList(req),
		type: req.body.type,
		value: req.body.value
	});
}

function renumber(req) {
	return Card.renumber(req.user.db, selectList(req));
}

function get(req) {
	return Card.get(req.user.db, selectListAndId(req));
}

function update(req) {
	const params = selectListAndId(req);
	assignWith(params, 'type', req.body.type, $not(isUndefined));
	assignWith(params, 'value', req.body.value, $not(isNaN));
	return Card.update(req.user.db, params);
}

function delete_(req) {
	return Card.delete(req.user.db, selectListAndId(req));
}

function sort(req) {
	return Card.sort(req.user.db, {
		...selectListAndId(req),
		value: parseFloat(req.body.value),
	});
}

