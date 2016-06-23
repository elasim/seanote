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
		return this._details;
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
