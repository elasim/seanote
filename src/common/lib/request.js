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
	if (url.indexOf('/api') > -1) {
		delete param.credentials;
	}
	if (data !== undefined) {
		if (typeof data !== 'string') {
			param.body = JSON.stringify(data);
		} else {
			param.body = data;
		}
	}
	return fetch(url, param);
}

export default {
	get: request.bind(null, 'GET'),
	post: request.bind(null, 'POST'),
	patch: request.bind(null, 'PATCH'),
	put: request.bind(null, 'PUT'),
	delete: request.bind(null, 'DELETE'),
	bulk(url, reqArray, headers) {
		const data = reqArray.map(JSON.stringify).join('\n');
		return request('POST', url, data, {
			'Content-Type': 'application/vnd.seanote.stream+json',
			'Content-Length': data.length,
			...headers,
		});
	}
};
