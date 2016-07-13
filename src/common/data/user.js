import request from '../lib/request';

export default {
	whoami,
};

export async function whoami() {
	try {
		const res = await request.get('/api/user');
		return await res.json();
	} catch (e) {
		return null;
	}
}
