import sequelize from './sequelize';
import { User, UserClaim, UserLogin, UserProfile } from './user';
import { Group, GroupProfile } from './group';
import { Author, Board, List, Card } from './board';

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

Board.belongsTo(Board, { as: 'Before', foreginKey: { allowNull: true } });
Board.hasMany(List);
Board.belongsTo(Author, { as: 'Owner' });

List.belongsTo(List, { as: 'Before', foreginKey: { allowNull: true }  });

List.hasMany(Card);

Card.belongsTo(Card, { as: 'Before', foreginKey: { allowNull: true }  });

export {
	// Boards
	Author,
	Board,
	List,
	Card,
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
			console.error(e);
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

// Because sequelize don't support stored procedure for some rdbms
// create user template manually on single transaction
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

	await userTemplate.board.reduce(async (beforeId, boardTemplate) => {
		const { list, ...props } = boardTemplate;
		const board = await Board.create({
			...props,
			OwnerId: author.id,
			BeforeId: await beforeId,
		}, t);
		await list.reduce(async (beforeId, listTemplate) => {
			const { name, items } = listTemplate;
			const list = await List.create({
				name,
				BoardId: board.id,
				BeforeId: await beforeId,
			}, t);
			await items.reduce(async (beforeId, cardTemplate) => {
				const card = await Card.create({
					value: cardTemplate,
					ListId: list.id,
					BeforeId: await beforeId,
				}, t);
				return card.id;
			}, Promise.resolve(null));
			return list.id;
		}, Promise.resolve(null));
		return board.id;
	}, Promise.resolve(null));
	
	return user;
}

[
	Author,
	Board,
	List,
	Card,
	User,
	UserClaim,
	UserLogin,
	UserProfile,
	Group,
	GroupProfile,
].forEach(t => t.sync({ force: !0 }));
