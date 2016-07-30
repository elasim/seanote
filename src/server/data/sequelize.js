import Sequelize from 'sequelize';
import config from '../lib/config';

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const setup = {
	benchmark: IS_DEBUG,
};
if (config.sequelize.logging !== undefined) {
	setup.logging = config.sequelize.logging;
}

export default new Sequelize(config.sequelize.connectionString, setup);

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
