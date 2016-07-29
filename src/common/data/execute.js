import Rx from 'rx';
import contentType from 'content-type';
import request from '../lib/request';

const deferrables = new Rx.Subject();

deferrables
	.bufferWithTime(250)
	.flatMap(buffer => {
		return Rx.Observable.from(buffer)
			.groupBy(value => value.comparable(value))
			.flatMap(group => group.reduce((before, current) => {
				return before ? current.selectable(current, before) : current;
			}))
			.toArray();
	})
	.distinctUntilChanged()
	.subscribe(async requests => {
		if (requests.length === 0) {
			return;
		} else if (requests.length === 1) {
			const { resolve, reject } = requests[0].deferrable;
			try {
				const result = await executeNow(requests[0]);
				resolve(result);
			} catch (e) {
				reject(e);
			}
		} else {
			try {
				const bulkResult = await bulkExecute(requests);
				for (let i = 0; i < requests.length; ++i) {
					const result = bulkResult.result[i];
					const { resolve, reject } = requests[i].deferrable;
					const finish = result.error ? resolve : reject;
					finish(result);
				}
			} catch (e) {
				for (const req of requests) req.deferrable.reject(e);
			}
		}
	});

export default async function execute(req) {
	if (!req.deferrable) {
		return await executeNow(req);
	} else {
		return await new Promise((resolve, reject) => {
			deferrables.onNext({
				...req,
				deferrable: {
					...req.deferrable,
					resolve,
					reject
				},
			});
		});
	}
}

async function executeNow(req) {
	const { url, method, body } = req;
	try {
		const res = await request[method](url, body);
		return await handleResponse(res);
	} catch (e) {
		throw e;
	}
}

export async function bulkExecute(reqs) {
	try {
		const res = await request.bulk('/api/_bulk', reqs.map(req => {
			const { url, method, body } = req;
			return { [url.replace(/^\/api/, '')]: [method, body] };
		}));
		return await handleResponse(res);
	} catch (e) {
		throw e;
	}
}

async function handleResponse(res) {
	const content = contentType.parse(res.headers.get('content-type'));
	switch (content.type) {
		case 'application/json':
			return await res.json();
		default: {
			if (res.status >= 300) {
				const error = new Error('request error', res.status);
				error.status = res.status;
				error.response = res;
				throw error;
			}
			return res.status;
		}
	}
}