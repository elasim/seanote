import Sequelize from 'sequelize';
import sequelize, { TYPE } from '../sequelize';

export const Publishers = sequelize.define('Publisher', {
	id: TYPE.ID,
	type: {
		type: Sequelize.STRING,
	}
}, {
	timestamps: false,
});
