import { EventEmitter } from 'events';

import webpack from 'webpack';

export default class LiveCompiler extends EventEmitter {
	constructor(config) {
		super();
		this._watcher = null;
		this._compiler = webpack(config);
	}
	start() {
		if (this._watcher) {
			return;
		}
		
		this._watcher = this._compiler.watch({
			poll: true,
			aggregateTimeout: 300
		}, (e, stats) => {
			if (e) {
				console.error(e);
				this.emit('error', e);
			}
			const event = !stats.hasErrors() ? 'success' : 'failure';
			this.emit(event, stats);
		});
	}
	stop() {
		if (!this._watcher) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this._watcher.close(resolve);
			this._watcher = null;
		});
	}
}

