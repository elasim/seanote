import Sequelize from 'sequelize';
import sequelize from './sequelize';

const Group = sequelize.define('Group', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
});

const GroupProfile = sequelize.define('GroupProfile', {
	displayName: Sequelize.STRING,
	description: Sequelize.STRING,
	website: Sequelize.STRING,
	address: Sequelize.STRING,
	contact: Sequelize.STRING,
});

export {
	Group,
	GroupProfile,
};
