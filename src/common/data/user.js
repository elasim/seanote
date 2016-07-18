export default {
	whoami,
};

export function whoami() {
	return {
		url: '/api/user',
		method: 'get',
		async response(res) {
			return await res.json();
		}
	};
}
