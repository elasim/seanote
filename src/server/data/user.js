import Sequelize from 'sequelize';
import sequelize from './sequelize';

const User = sequelize.define('User', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true,
		defaultValue: Sequelize.UUIDV4,
	},
	role: {
		type: Sequelize.TEXT,
		defaultValue: 'user',
	},
});

const UserClaim = sequelize.define('UserClaim', {
	provider: { type: Sequelize.STRING, primaryKey: true },
	id: { type: Sequelize.STRING, primaryKey: true },
}, {
	timestamps: false,
});

const UserLogin = sequelize.define('UserLogin', {
	username: { type: Sequelize.STRING, primaryKey: true },
	password: { type: Sequelize.STRING, primaryKey: true },
}, {
	timestamps: false,
});

const UserProfile = sequelize.define('UserProfile', {
	UserId: { type: Sequelize.UUID, primaryKey: true },
	displayName: Sequelize.STRING,
	picture: Sequelize.STRING,
	email: Sequelize.STRING,
	company: Sequelize.STRING,
	website: Sequelize.STRING,
	location: Sequelize.STRING,
	gender: { type: Sequelize.ENUM('Male', 'Female') },
});

export {
	User,
	UserClaim,
	UserLogin,
	UserProfile,
};
