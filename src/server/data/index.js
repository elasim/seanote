import sequelize from './sequelize';
import { User, UserClaim, UserLogin, UserProfile } from './user';
import { Group, GroupProfile } from './group';
import { Author, Board, List } from './board';

import userTemplate from './user.template';

// Author is a User or Group

const GroupUsersRelations = { through: 'GroupUsers' };
Group.hasOne(GroupProfile);
Group.belongsTo(Author);
Group.belongsTo(User, { as: 'Owner '});
Group.belongsToMany(User, GroupUsersRelations);

User.hasOne(UserProfile);
User.belongsTo(Author);
User.belongsToMany(Group, GroupUsersRelations);

UserLogin.belongsTo(User);
UserClaim.belongsTo(User);

Board.hasMany(List);
Board.belongsTo(Author, { as: 'Owner' });

export {
	// Boards
	Author,
	Board,
	List,
	// Users
	User,
	UserClaim,
	UserLogin,
	UserProfile,
	// Groups
	Group,
	GroupProfile,
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
	const author = await Author.create({
		type: 'user'
	}, t);
	const user = await User.create({
		AuthorId: author.id
	}, t);
	await UserProfile.create({
		UserId: user.id,
		...profiles,
	}, t);
	const board = await Board.create({
		...userTemplate.board,
		OwnerId: author.id,
	}, t);
	userTemplate.list.forEach(async listItem => {
		await List.create({
			...listItem,
			BoardId: board.id
		}, t);
	});
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
	Group,
	GroupProfile,
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
