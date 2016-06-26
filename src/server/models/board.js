import Sequelize from 'sequelize';
import sequelize from './sequelize';

const Author = sequelize.define('authors', {
	id: { type: Sequelize.UUID, primaryKey: true },
});

const Board = sequelize.define('boards', {
	id: Sequelize.UUID,
	name: Sequelize.STRING,
	isPublic: Sequelize.BOOLEAN,
}, {
	id: { primaryKey: true },
	isPublic: { defaultValue: true },
});

const List = sequelize.define('lists', {
	id: Sequelize.UUID,
	position: Sequelize.INT,
	name: Sequelize.STRING,
	isClosed: Sequelize.BOOLEAN,
	items: {
		get: () => JSON.parse(this.items),
		set: (value) => this.setDataValue('items', JSON.stringify(value)),
	},
}, {
	id: { primaryKey: true },
	isClosed: { defaultValue: true },
	position: {
		validate: {
			min: 0,
		}
	},
});

export { Author, Board, List };
