import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './lib/request';

const base = '/api/board';
export default {
	all(token, board) {
		return {
			url: `${base}/${board}/lists`,
			method: 'get',
			token,
		};
	},
	find(token, board, id) {
		return {
			url: `${base}/${board}/lists/${id}`,
			method: 'get',
			token,
		};
	},
	create(token, board, { name }={}) {
		return {
			url: `${base}/${board}/lists`,
			method: 'put',
			body: { name },
			token
		};
	},
	update(token, board, id, { name, isClosed }={}) {
		return {
			url: `${base}/${board}/lists/${id}`,
			method: 'patch',
			body: {
				name,
				close: isClosed ? 1 : 0
			},
			token
		};
	},
	remove(token, board, id) {
		return {
			url: `${base}/${board}/lists/${id}`,
			method: 'delete',
			token
		};
	},
	renumber(token, board) {
		return {
			url: `${base}/${board}/lists/_renumber`,
			method: 'post',
			token,
		};
	},
	sort(token, board, id, { value }) {
		return {
			url: `${base}/${board}/lists/${id}/_sort`,
			method: 'patch',
			body: { value },
			token
		};
	}
};
