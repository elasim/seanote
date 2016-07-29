import uuid from 'uuid';
import queryString from 'qs/lib/stringify';

import { deferredSelectFirst, deferredSelectLast } from './request';

export default function createModel(opt) {
	const { base } = opt;
	const genid = opt.genid || uuid.v4;
	return {
		...opt.methods,
		get(id) {
			return deferredSelectFirst({
				url: id ? `${base}/${id}` : base,
				method: 'get',
			});
		},
		find(query, params) {
			const queries = { ...query };
			if (params) {
				for (const key in params ) {
					queries[`_${key}`] = params[key];
				}
			}

			const q = queryString(queries);
			return deferredSelectFirst({
				url: `${base}?${q}`,
				method: 'get',
			});
		},
		create(id, data) {
			id = id ||  genid();
			data = { id, ...data };
			return {
				url: `${base}/${id}`,
				method: 'put',
				data,
			};
		},
		update(id, data) {
			return deferredSelectLast({
				url: `${base}/${id}`,
				method: 'post',
				data,
			});
		},
		updateQuery(query, data) {
			const q = queryString({ query });
			return deferredSelectLast({
				url: `${base}?${q}`,
				method: 'post',
				data,
			});
		},
		remove(id) {
			return deferredSelectLast({
				url: `${base}/${id}`,
				method: 'delete',
			});
		},
		removeQuery(query) {
			const q = queryString({ query });
			return deferredSelectLast({
				url: `${base}?${q}`,
				method: 'delete',
			});
		},
	};
}
