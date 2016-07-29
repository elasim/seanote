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

// Pros: Easily Update and Find for Single Row
// Cons: Need to full-text search and application level processing
export const BoardPrivacySettings = sequelize.define('BoardPrivacySetting', {
	BoardId: Sequelize.UUID,
	roleId: Sequelize.UUID,
	rule: Sequelize.STRING,
}, {
	timestamps: false,
	indexes: [
		{ fields: ['roleId'] },
		{ fields: ['BoardId', 'roleId'] },
		{ fields: ['roleId', 'rule'] },
	]
});
