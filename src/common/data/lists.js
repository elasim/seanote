import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './lib/request';

const base = '/api/board';
export default {
	all(token, id) {
		return {
			url: `${base}/${id}/lists`,
			method: 'get',
			token,
		};
	}
};
