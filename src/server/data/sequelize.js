import Sequelize from 'sequelize';
import config from '../lib/config';

export default new Sequelize(config.sequelize.connectionString);
