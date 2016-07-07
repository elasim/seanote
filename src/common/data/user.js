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
	async signUp(form) {
		const { email, username, password } = form;
		try {
			const res = await request.put('/auth/signup', {
				email: email.trim(),
				username: username.trim(),
				password,
			});
			if (res.status === 200) {
				return true;
			}
			const content = await res.json();
			return Promise.reject(new Error(content.error));
		} catch (e) {
			console.log(e);
			return Promise.reject(new Error('Unknown Reason'));
		}
	},
	async signIn(email, password) {
		try {
			const res = await request.post('/auth/signin', {
				email: email.trim(),
				password: password,
			});
			if (200 <= res.status && res.status < 300) {
				return res.json().token || Promise.reject(new Error('Request succeeded, but Token was not provided'));
			} else {
				return Promise.reject(new Error('Invalid Login'));
			}
		} catch (e) {
			return Promise.reject(e);
		}
	},
};
