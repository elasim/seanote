import Sequelize from 'sequelize';
import sequelize from '../config/sequelize';

const Organization = sequelize.define('organizations', {
	id: Sequelize.UUID,
}, {
	id: { primaryKey: true },
});

const OrganizationProfile = sequelize.define('organization_profile', {
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
