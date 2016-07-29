import Sequelize from 'sequelize';
import sequelize, { TYPE } from '../sequelize';

export const Groups = sequelize.define('Group', {
	id: TYPE.ID,
});

export const GroupProfiles = sequelize.define('GroupProfile', {
	displayName: Sequelize.STRING,
	description: Sequelize.STRING,
	website: Sequelize.STRING,
	address: Sequelize.STRING,
	contact: Sequelize.STRING,
});

export const GroupUsers = sequelize.define('GroupUsers', {
	UserId: {
		type: Sequelize.UUID,
		primaryKey: true,
	},
	GroupId: {
		type: Sequelize.UUID,
		primaryKey: true,
	},
}, {
	timestamps: true,
	updatedAt: false,
});
