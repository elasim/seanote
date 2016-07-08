import Sequelize from 'sequelize';
import sequelize from './sequelize';

const Author = sequelize.define('Author', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	type: {
		type: Sequelize.STRING,
	}
}, {
	timestamps: false,
});

const Board = sequelize.define('Board', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: Sequelize.STRING,
	isPublic: { type: Sequelize.BOOLEAN, defaultValue: false },
});

const List = sequelize.define('List', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	position: Sequelize.INTEGER,
	name: Sequelize.STRING,
	isClosed: { type: Sequelize.BOOLEAN, defaultValue: true },
	items: {
		type: Sequelize.TEXT,
		get: function () {
			return JSON.parse(this.items);
		},
		set: function (value) {
			this.setDataValue('items', JSON.stringify(value));
		},
	},
}, {
	position: {
		validate: {
			min: 0,
		}
	},
});

export { Author, Board, List };
