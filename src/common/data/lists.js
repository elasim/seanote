import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './lib/request';

const base = '/api/board/';
export default {
	all(id) {
		return deferredSelectFirst({
			url: `${base}/${id}`,
			method: 'get',
		});
	}
};
