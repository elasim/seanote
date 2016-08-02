import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './lib/request';

const base = '/api/board/';
export default {
	all(token, id) {
		return deferredSelectFirst({
			url: `${base}/${id}`,
			method: 'get',
			token,
		});
	}
};
