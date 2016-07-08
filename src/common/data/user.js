import request from '../lib/request';

export default {
	async whoami() {
		try {
			const res = await request.get('/api/user');
			return await res.json();
		} catch (e) {
			return null;
		}
	},
};
