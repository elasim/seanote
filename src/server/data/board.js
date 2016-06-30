import Sequelize from 'sequelize';
import sequelize from './sequelize';

const Author = sequelize.define('authors', {
	id: { type: Sequelize.UUID, primaryKey: true },
});

const Board = sequelize.define('boards', {
	id: { type: Sequelize.UUID, primaryKey: true },
	name: Sequelize.STRING,
	isPublic: { type: Sequelize.BOOLEAN, defaultValue: false },
});

const List = sequelize.define('lists', {
	id: { type: Sequelize.UUID, primaryKey: true },
	position: Sequelize.INTEGER,
	name: Sequelize.STRING,
	isClosed: { type: Sequelize.BOOLEAN, defaultValue: true },
	items: {
		type: Sequelize.TEXT,
		get: () => JSON.parse(this.items),
		set: (value) => this.setDataValue('items', JSON.stringify(value)),
	},
}, {
	position: {
		validate: {
			min: 0,
		}
	},
});

export { Author, Board, List };
