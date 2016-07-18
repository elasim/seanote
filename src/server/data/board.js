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
	priority: { type: Sequelize.DOUBLE.UNSIGNED },
	isPublic: { type: Sequelize.BOOLEAN, defaultValue: false },
});

const List = sequelize.define('List', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: Sequelize.STRING,
	priority: { type: Sequelize.DOUBLE.UNSIGNED },
	isClosed: { type: Sequelize.BOOLEAN, defaultValue: true },
});

const Card = sequelize.define('Card', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	priority: { type: Sequelize.DOUBLE.UNSIGNED },
	value: {
		type: Sequelize.TEXT,
		get: function () {
			return JSON.parse(this.getDataValue('value'));
		},
		set: function (value) {
			this.setDataValue('value', JSON.stringify(value));
		},
	},
});

export { Author, Board, List, Card };
