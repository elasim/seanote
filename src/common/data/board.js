export default {
	getList,
	renumber,
};

export function getList(offset, limit) {
	return {
		url: `/api/board?offset=${offset}&limit=${limit}`,
		method: 'get',
		async response(res) {
			if (res.status < 200 || res.status >= 300) {
				throw new Error('status code not allowed');
			}
			return await res.json();
		}
	};
}

export function renumber() {
	return {
		url: '/api/board/_renumber',
		method: 'post',
		async response(res) {
			if (res.status !== 200) {
				throw new Error('Renumber Fail');
			}
		}
	};
}

export function update(id, data) {
	return {
		url: `/api/board/${id}`,
		method: 'post',
		body: data,
		async response(res) {
			return await res.toJson();
		}
	};
}
