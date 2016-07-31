import Sequelize from 'sequelize';
import sequelize, { TYPE } from '../sequelize';

export const Users = sequelize.define('User', {
	id: TYPE.ID,
	role: {
		type: Sequelize.TEXT,
		defaultValue: 'user',
	},
});

export const UserClaims = sequelize.define('UserClaim', {
	provider: { type: Sequelize.STRING, primaryKey: true },
	id: { type: Sequelize.STRING, primaryKey: true },
}, {
	timestamps: false,
});

export const UserLogins = sequelize.define('UserLogin', {
	username: { type: Sequelize.STRING, primaryKey: true },
	password: Sequelize.STRING,
	salt: Sequelize.STRING,
}, {
	timestamps: false,
});

export const UserProfiles = sequelize.define('UserProfile', {
	UserId: { type: Sequelize.UUID, primaryKey: true },
	displayName: Sequelize.STRING,
	picture: Sequelize.STRING,
	email: {
		type: Sequelize.STRING,
		validate: { isEmail: true },
	},
	company: Sequelize.STRING,
	website: Sequelize.STRING,
	location: Sequelize.STRING,
	gender: { type: Sequelize.ENUM('Male', 'Female') },
});
