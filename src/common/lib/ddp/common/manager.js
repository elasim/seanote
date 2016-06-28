
export default class DDPManager {
	models = {};

	constructor(opt) {

	}
	model(ModelType, name) {
		if (this.models[name]) {
			return this.models[name];
		}
		const model = new ModelType(name, this);
		this.models[name] = model;

		return model;
	}
}
