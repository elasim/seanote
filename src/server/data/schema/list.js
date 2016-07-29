import Sequelize from 'sequelize';
import sequelize, { TYPE } from '../sequelize';

export const Lists = sequelize.define('List', {
	id: TYPE.ID,
	name: Sequelize.STRING,
	priority: Sequelize.DOUBLE.UNSIGNED,
	isClosed: { type: Sequelize.BOOLEAN, defaultValue: true },
});
