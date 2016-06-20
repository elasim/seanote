// Mockup User Model
export default new class {
	isAvailableName(id) {
		return id !== 'admin';
	}
	isAvailableEmail(email) {
		return email !== 'admin@admin';
	}
	signUp(data) {
		return new Promise(resolve => {
			this._list = [
				{...data}
			];
			setTimeout(() => resolve(true), 2000);
		});
	}
	signIn(/* data */) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Failure'));
			}, 1000);
		});
	}
};
