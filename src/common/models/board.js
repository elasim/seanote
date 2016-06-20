import _ from 'lodash';
import uuid from 'uuid';
import Faker from 'faker';

// MOCK
export default new class Board {
	all() {
		return _.cloneDeep(testItems);
	}
	getDetails(id) {
		const board = testItems.find(item => {
			return item.id === id;
		});
		return _.cloneDeep({
			...board,
			items: testDetails,
			trashItems: [],
		});
	}
	enumerateTypes() {
		return _.clone(DetailItemTypes);
	}
};

const DetailItemTypes = [
	('Note'),
	('Link'),
	('People'),
	('Schedule'),
	('Video'),
	('Audio'),
	('Map')
];
const testDetails = [
	{
		id: 'id1',
		type: DetailItemTypes[0],
		detail: {
			text: Faker.lorem.words()
		}
	},
	{
		id: 'id2',
		type: DetailItemTypes[0],
		detail: {
			text: Faker.lorem.words()
		}
	},
	{
		id: 'id3',
		type: DetailItemTypes[0],
		detail: {
			text: Faker.lorem.words()
		}
	},
	{
		id: 'id4',
		type: DetailItemTypes[0],
		detail: {
			text: Faker.lorem.words()
		}
	},
	{
		id: 'id5',
		type: DetailItemTypes[0],
		detail: {
			text: Faker.lorem.words()
		}
	},
];

// MOCK
const testItems = [
	{
		id: 'board1',
		name: 'Test Board 1',
		text: Faker.lorem.paragraph(),
		createdAt: Faker.date.past(),
	},
	{
		id: 'board2',
		name: 'Test Board 2',
		text: Faker.lorem.paragraph(),
		createdAt: Faker.date.past(),
	},
	{
		id: 'board3',
		name: 'Test Board 3',
		text: Faker.lorem.paragraph(),
		createdAt: Faker.date.past(),
	},
	{
		id: 'board4',
		name: 'Test Board 4',
		text: Faker.lorem.paragraph(),
		createdAt: new Date(),
	},
	{
		id: 'board5',
		name: 'Test Board 5 LAAAAAAAAAAAAAAAOOOOOOOOOOOOOONG',
		text: Faker.lorem.paragraph(),
		createdAt: new Date(-400),
	},
];
