import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './lib/request';

const base = '/api/board';

export default {
	all(token, offset, limit) {
		if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
			throw new Error('validation failure');
		}
		if (!(Number.isInteger(offset) && offset >= 0)) {
			throw new Error('validation failure');
		}
		const queries = {};
		if (limit) queries.limit = limit;
		if (offset) queries.offset = offset;
		const q = queryString(queries);
		return {
			url: `${base}?${q}`,
			method: 'get',
			token,
		};
	},
	find(token, id) {
		
	},
	create(token, id, { name, isPublic }) {
		return {
			url: `${base}`,
			method: 'put',
			body: {
				name,
				public: isPublic ? 1 : 0,
			},
			token,
		};
	},
	update(token, id, { name, isPublic }) {
		return deferredSelectLast({
			url: `${base}/${id}`,
			method: 'post',
			body: {
				name,
				public: isPublic ? 1 : 0,
			},
			token,
		});
	},
	remove(token, id) {
		return {
			url: `${base}/${id}`,
			method: 'delete',
			token
		};
	},
	renumber(token) {
		return deferredSelectFirst({
			url: `${base}/_renumber`,
			method: 'post',
			token,
		});
	},
	sort(token, id, { value }) {
		return deferredSelectLast({
			url: `${base}/${id}/_sort`,
			method: 'post',
			body: { value },
			token,
		});
	}
};
