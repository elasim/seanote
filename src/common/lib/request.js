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
	put: request.bind(null, 'PUT'),
	delete: request.bind(null, 'DELETE'),
	bulk(url, reqArray) {
		const data = reqArray.map(JSON.stringify).join('\n');
		return request('POST', url, data, {
			'Content-Type': 'application/vnd.seanote.stream+json',
			'Content-Length': data.length,
		});
	}
};
