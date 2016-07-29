import Sequelize from 'sequelize';
import config from '../lib/config';

export default new Sequelize(config.sequelize.connectionString);

export const TYPE = {
	ID: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV4,
		validate: {
			isUUID: 4
		},
	},
};
