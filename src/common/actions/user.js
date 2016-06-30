import 'isomorphic-fetch';
import request from '../lib/request';

export default class User extends LiveAction {
	token = null;
	constructor(store) {
		super(store);
	}
	bind(io) {
		super.bind(io);
		io.on('user', action => {
			switch (action.type) {
				case 'USER-TOKEN-EXPIRED':
					this.expireToken();
					break;
			}
		});
	}
	expireToken() {
		this.token = null;
		this.dispatch(UserAction.expireToken());
	}
	async login(id, pw) {
		if (this.token) {
			return this.token;
		}
		try {
			const result = await request.get('/api/user/token', { id, pw });
			if (!result || !result.token) {
				return false;
			}
			this.token = result.token;
		} catch (e) {
			// network failure
			throw new Error('Network Failure');
		}
		return this.token;
	}
	async logout() {
		if (!this.token) {
			return true;
		}
		try {
			const result = await request.delete('/api/user/token', this.getPayload());
			if (!result) {
				return false;
			}
			this.token = null;
		} catch (e) {
			throw new Error('Network Failure');
		}
		return true;
	}
	async updateToken() {
		if (!this.token) {
			return false;
		}
		try {
			const result = request.get('/api/user/token', this.getPayload());
			if (result)
		} catch (e) {

		}
	}

	getPayload(data) {
		return {
			...data,
			token: this.token
		};
	}
}
