
export default class Model {
	constructor(name, manager) {
		this.name = name;
		this.manager = manager;
	}
	findAll(opt) {
		const { name, manager } = this;
		return new Promise(async (resolve, reject) => {
			const id = manager.getNextOpId();

			reject(new Error('Failure'));
		});
	}
}
