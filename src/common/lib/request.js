function request(method, url, data, headers) {
	const param = {
		method,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers,
		},
		credentials: 'same-origin',
	};
	if (data !== undefined) {
		param.body = JSON.stringify(data);
	}
	return fetch(url, param);
}

export default {
	get: request.bind(null, 'GET'),
	post: request.bind(null, 'POST'),
	put: request.bind(null, 'PUT'),
	delete: request.bind(null, 'DELETE'),
};
