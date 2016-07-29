import Sequelize from 'sequelize';
import sequelize, { TYPE } from '../sequelize';

export const Cards = sequelize.define('Card', {
	id: TYPE.ID,
	priority: Sequelize.DOUBLE.UNSIGNED,
	value: {
		type: Sequelize.TEXT,
		get: function () {
			return JSON.parse(this.getDataValue('value'));
		},
		set: function (value) {
			this.setDataValue('value', JSON.stringify(value));
		},
	},
});
