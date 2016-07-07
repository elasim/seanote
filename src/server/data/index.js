import sequelize from './sequelize';
import { User, UserClaim, UserLogin, UserProfile } from './user';
import { Organization, OrganizationProfile } from './organization';
import { Author, Board, List } from './board';

const OrganizationUsersRelationship = { through: 'OrganizationUsers' };
Board.hasMany(List);
Board.belongsTo(Author, { as: 'Owner' });

// Author is a User or Group
UserLogin.belongsTo(User);
UserClaim.belongsTo(User);
UserProfile.belongsTo(User);

User.hasMany(Organization, { as: 'Owner' });
User.belongsTo(Author);
User.belongsToMany(Organization, OrganizationUsersRelationship);

Organization.hasOne(OrganizationProfile);
Organization.belongsTo(Author);
Organization.belongsToMany(User, OrganizationUsersRelationship);

export {
	// Board
	Author,
	Board,
	List,
	// User
	User,
	UserClaim,
	UserLogin,
	UserProfile,
	// Organization
	Organization,
	OrganizationProfile,
};


User.createWithClaim = (provider, id, profiles) => {
	return sequelize.transaction().then(async transaction => {
		const t = { transaction };
		try {
			const user = await createUser(t, profiles);
			await UserClaim.create({
				UserId: user.id,
				provider,
				id,
			}, t);
			await transaction.commit();
			return Promise.resolve(user);
		} catch (e) {
			await transaction.rollback();
			return Promise.reject(e);
		}
	});
};

User.createWithLogin = (username, password) => {
	return sequelize.transaction().then(async transaction => {
		const t = { transaction };
		try {
			const user = await createUser(t);
			await UserLogin.create({
				UserId: user.id,
				username,
				password,
			}, t);
			await transaction.commit();
			return Promise.resolve(user);
		} catch (e) {
			await transaction.rollback();
			return Promise.reject(e);
		}
	});
};

async function createUser(t, profiles) {
	const author = await Author.create({}, t);
	console.log(author.id);
	const user = await User.create({
		AuthorId: author.id
	}, t);
	await UserProfile.create({
		UserId: user.id,
		...profiles,
	}, t);
	return user;
}

[
	Author,
	Board,
	List,
	User,
	UserClaim,
	UserLogin,
	UserProfile,
	Organization,
	OrganizationProfile,
].forEach(t => t.sync({ force: !0 }));

/**
 * Sequelize Associations
 * A hasOne B [as NAME, foreignKey FK]
 * A hasMany B [as NAME, foreginKey FK]
 * -> getter/setter in A (getB, setB or getNAME)
 * -> B schema {..., BId, B_id, FK }
 * 
 * A belongsTo B [as NAME, foreignKey FK, targetKey B_KEY_COLUMN]
 * A belongsToMany B [as NAME, foreginKey FK, targetKey B_KEY_COLUMN]
 */
