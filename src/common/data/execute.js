import request from '../lib/request';

export default async function execute(req) {
	const { url, method, response, body } = req;
	const res = await request[method](url, body);
	return response(res);
}

export async function bulkExecute(reqs) {
	return await request.bulk('/api/_bulk', reqs.map(req => {
		const { url, method, body } = req;
		return { [url.replace(/^\/api/, '')]: [method, body] };
	}));
}
