import DDPManager from '../common/manager';
import Model from './model';
import SocketIO from 'socket.io-client';

import Rx from 'rx';

const defaultConfig = {
	timeout: 1000,
};

export default class DDPClient extends DDPManager {
	constructor(uri, cfg = defaultConfig) {
		super();
		this.config = {
			uri,
			...cfg,
		};
		this.models = {};
	}

	model(name) {
		return super.model(Model, name);
	}
	_connect() {
		return new Promise((resolve, reject) => {
			const { uri, timeout } = this.config;
			const io = SocketIO(uri);
			Rx.Observable.from(io, 'connect')
				.take(1)
				.timeout(timeout)
				.subscribe(() => {
					this.io = io;
					resolve();
				}, e => reject(e));
		});
	}
	_close() {
		this.io.disconnect();
	}
}
