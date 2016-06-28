import DDPManager from '../common/manager';
import Model from './model';

import Rx from 'rx';

export default class DDPServer extends DDPManager {
	constructor(io) {
		super();
		this._io = io;
	}
	get io() {
		return this._io;
	}
	model(name) {
		return super.model(Model, name);
	}
}
