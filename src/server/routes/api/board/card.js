import CardController from '../../../controllers/card';
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
	return CardController.all(req.user.db, selectList(req));
}

function create(req) {
	return CardController.create(req.user.db, {
		...selectList(req),
		type: req.body.type,
		value: req.body.value
	});
}

function renumber(req) {
	return CardController.renumber(req.user.db, selectList(req));
}

function get(req) {
	return CardController.get(req.user.db, selectListAndId(req));
}

function update(req) {
	const params = selectListAndId(req);
	assignWith(params, 'type', req.body.type, $not(isUndefined));
	assignWith(params, 'value', req.body.value, $not(isNaN));
	return CardController.update(req.user.db, params);
}

function delete_(req) {
	return CardController.delete(req.user.db, selectListAndId(req));
}

function sort(req) {
	return CardController.sort(req.user.db, {
		...selectListAndId(req),
		value: parseFloat(req.body.value),
	});
}

