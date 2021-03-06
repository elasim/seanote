import Sequelize from 'sequelize';
import sequelize, { TYPE } from '../sequelize';

export const Boards = sequelize.define('Board', {
	id: TYPE.ID,
	name: Sequelize.STRING,
	isPublic: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
}, {
	indexes: [
		{
			fields: ['isPublic']
		}
	]
});

export const BoardSorts = sequelize.define('BoardSort', {
	BoardId: {
		type: Sequelize.UUID,
		primaryKey: true,
	},
	UserId: {
		type: Sequelize.UUID,
		primaryKey: true
	},
	priority: Sequelize.DOUBLE.UNSIGNED,
}, {
	timestamps: false,
});

const MODE = {
	// board (share, delete)
	EXECUTE: 1,
	// list,card (create, update, delete, sort, renumber)
	WRITE: 2,
	// board,list,card (read, all)
	READ: 4,
	ALL: 7,
};

const BoardPrivacySettings = sequelize.define('BoardPrivacySetting', {
	BoardId: {
		type: Sequelize.UUID,
		primaryKey: true,
	},
	roleId: {
		type: Sequelize.UUID,
		primaryKey: true,
	},
	mode: {
		type: Sequelize.INTEGER,
		defaultValue: MODE.READ | MODE.WRITE
	}
}, {
	timestamps: false,
	indexes: [
		{ fields: ['roleId'] },
		{ fields: ['roleId', 'mode'] },
	]
});
BoardPrivacySettings.Mode = MODE;
export { BoardPrivacySettings };
