import Sequelize from 'sequelize';
import config from '../lib/config';

const IS_DEBUG = process.env.NODE_ENV !== 'production';

export default new Sequelize(config.sequelize.connectionString, {
	benchmark: IS_DEBUG,
});

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
