import { EventEmitter } from 'events';

import webpack from 'webpack';

export default class LiveCompiler extends EventEmitter {
	constructor(config) {
		super();
		this._watcher = null;
		this._compiler = webpack(config);
		this._needPrintError = false;

		this.on('newListener', (event) => {
			if (event === 'error') {
				this._needPrintError = this.listenerCount('error') === 0;
			}
		});
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
				if (this._needPrintError) {
					console.error(e);
				}
				this.emit('error', e);
				this._watcher.cloes();
				this._watcher = null;
				return;
			}
			const event = !stats.hasErrors() ? 'success' : 'failure';
			this.emit(event, stats);
			if (this._needPrintError) {
				console.log(stats.toString());
			}
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
