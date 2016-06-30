import 'isomorphic-fetch';

function request(method, url, data) {
	const param = { method };
	if (data !== undefined) {
		param.headers = { 'Content-Type': 'application/json' };
		param.data = JSON.stringify(data);
	}
	return fetch(url, param)
		.then(res => {
			try {
				const data = res.json();
				return data;
			} catch (e) {
				if (res.status === 200) {
					return true;
				} else {
					return false;
				}
			}
		});
}

export default {
	get: request.bind(null, 'GET'),
	post: request.bind(null, 'POST'),
	put: request.bind(null, 'PUT'),
	delete: request.bind(null, 'DELETE'),
};
