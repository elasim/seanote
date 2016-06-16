import path from 'path';
import { EventEmitter } from 'events';

import spawn from '../common/spawn';

export default class Server extends EventEmitter {
	constructor(config) {
		super();
		const { output } = config;
		this._host = null;
		this._serverPath = path.join(output.path, output.filename);
	}
	start() {
		if (this._handle) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this._handle = spawn('SERVER', this._serverPath, [], {
				env: process.env,
				cwd: process.cwd()
			});
			this._handle.on('error', e => {
				this.emit('error', e);
				this.stop();
			});
			this._handle.on('exit', () => {
				this._handle = null;
				this.emit('stop');
			});
			this._handle.stdout.once('data', resolve);
			this._handle.stderr.once('data', resolve);
		});
	}
	stop() {
		if (!this._handle) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this._handle.once('exit', () => {
				this._handle = null;
				resolve();
			});
			this._handle.kill('SIGKILL');
		});
	}
}
