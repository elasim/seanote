export function getCards(id) {
	return {
		url: `/api/board/${id}`,
		method: 'get',
		async response(res) {
			if (200 < res.status || res.status >= 300) throw new Error('Request Status Error');
			return await res.json();
		}
	};
}
