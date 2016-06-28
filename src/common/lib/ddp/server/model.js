import ModelBase from '../common/model';

// DdpServer.Model
export default class Model extends ModelBase {
	constructor(name) {
		super(name);
		// something!
	}
	// thats all
	connect(objModel) {
		this._objModel = objModel;
		return this;
	}
}
