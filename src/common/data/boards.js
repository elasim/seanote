import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './lib/request';

const base = '/api/board';

export default {
	all(offset, limit) {
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
		return deferredSelectFirst({
			url: `${base}?${q}`,
			method: 'get',
		});
	},
	create(name, isPublic) {

	},
	renumber() {
		return deferredSelectFirst({
			url: `${base}/_renumber`,
			method: 'post',
		});
	}
};
