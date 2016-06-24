import _ from 'lodash';
import uuid from 'uuid';
import Faker from 'faker';

// MOCK
const testItems = require('./data').default;

const DetailItemTypes = [
	('Note'),
	('Link'),
	('People'),
	('Schedule'),
	('Video'),
	('Audio'),
	('Map')
];

// MOCK
export default new class Board {
	constructor() {
		this._details = _.cloneDeep(testItems);
	}
	all() {
		const which = !(Math.round(Math.random() * 10) % 2);
		const self = this;
		return new Promise((resolve, reject) => {
			if (which) {
				resolve(self._details);
			} else {
				reject(new Error('Fail Reason'));
			}
		});
	}
	getDetails(id) {
		return this._details.find(item => item.id);
	}
	update(id, newData) {
		const data = this._details.find(item => item.id === id);
		
	}
	enumerateTypes() {
		return _.clone(DetailItemTypes);
	}
};
