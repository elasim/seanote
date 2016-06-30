import Sequelize from 'sequelize';
import config from '../../config.json';

export default new Sequelize(config.sequelize.connectionString);
