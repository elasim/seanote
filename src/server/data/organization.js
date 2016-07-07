import Sequelize from 'sequelize';
import sequelize from './sequelize';

const Organization = sequelize.define('Organization', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
});

const OrganizationProfile = sequelize.define('OrganizationProfile', {
	displayName: Sequelize.STRING,
	description: Sequelize.STRING,
	website: Sequelize.STRING,
	address: Sequelize.STRING,
	contact: Sequelize.STRING,
});

export {
	Organization,
	OrganizationProfile,
};
