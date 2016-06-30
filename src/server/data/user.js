import Sequelize from 'sequelize';
import sequelize from './sequelize';

const User = sequelize.define('users', {
	id: { type: Sequelize.UUID, primaryKey: true },
	email: { type: Sequelize.STRING },
});

const UserClaim = sequelize.define('user_claim', {
	type: Sequelize.STRING,
	value: Sequelize.TEXT,
});

const UserLogin = sequelize.define('user_login', {
	name: { type: Sequelize.STRING, primaryKey: true },
	key: { type: Sequelize.STRING, primaryKey: true },
});

const UserProfile = sequelize.define('user_profile', {
	displayName: Sequelize.STRING,
	picture: Sequelize.STRING,
	company: Sequelize.STRING,
	website: Sequelize.STRING,
	location: Sequelize.STRING,
	gender: Sequelize.ENUM('Male', 'Female'),
});

export {
	User,
	UserClaim,
	UserLogin,
	UserProfile,
};
