import Board from '../../../models/board';
import HttpError from '../utils/http-error';
import { $select } from '../utils/functional';

export default {
	'/': {
		get: findAll,
		put: create,
	},
	'/_renumber': {
		post: renumber,
	},
	'/:board': {
		get: get,
		post: update,
		patch: update,
		delete: delete_,
	},
	'/:board/_sort': {
		post: sort,
		patch: sort,
	},
	'/:board/mode': {
		get: getMode,
		post: setMode,
		patch: setMode,
	},
};

const selectId = $select({
	id: o => o.params.board,
});

function findAll(req) {
	return Board.all(req.user.db, {
		offset: parseInt(req.query.offset, 10) || 0,
		limit: parseInt(req.query.limit, 10) || 10,
	});
}

function create(req) {
	return Board.create(req.user.db, {
		name: req.body.name,
		isPublic: parseInt(req.body.public),
	});
}

function renumber(req) {
	return Board.renumber(req.user.db);
}

function get(req) {
	return Board.get(req.user.db, selectId(req));
}

function update(req) {
	return Board.update(req.user.db, {
		...selectId(req),
		name: req.body.name,
		isPublic: parseInt(req.body.public)
	});
}

async function delete_(req) {
	try {
		await Board.delete(req.user.db, selectId(req));
	} catch (e) {
		throw e;
	}
}

function sort(req) {
	return Board.sort(req.user.db, {
		...selectId(req),
		value: parseFloat(req.body.value),
	});
}

function getMode(req) {
	const users = (req.query.users || req.user.db.PublisherId)
		.split(/,/g)
		.filter(x => x.length);
	return Board.getMode(req.user.db, {
		...selectId(req),
		user: users,
	});
}

function setMode(req) {
	const rules = (req.body.rules || '')
		.split(/,/g)
		.filter(str => str.length > 0)
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
	return Board.setMode(req.user.db, {
		...selectId(req),
		rule: rules,
	});
}
