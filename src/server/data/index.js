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

Board.hasMany(List);
Board.belongsTo(Author, { as: 'Owner' });

List.hasMany(Card);

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
	beginTransaction
};

function beginTransaction(opt) {
	return sequelize.transaction(opt);
}

User.createWithClaim = (provider, id, profiles) => {
	return beginTransaction().then(async transaction => {
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
	return beginTransaction().then(async transaction => {
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
async function createUser(transaction, profiles) {
	const author = await Author.create({
		type: 'user'
	}, transaction);
	const user = await User.create({
		AuthorId: author.id
	}, transaction);
	await UserProfile.create({
		UserId: user.id,
		...profiles,
	}, transaction);
	await Promise.all(userTemplate.board.map(async (boardTemplate, boardTemplateIndex) => {
		const { list, ...props } = boardTemplate;
		const board = await Board.create({
			...props,
			priority: boardTemplateIndex + 1,
			OwnerId: author.id,
		}, transaction);
		return await Promise.all(list.map(async (listTemplate, listTemplateIndex) => {
			const { name, items } = listTemplate;
			const list = await List.create({
				name,
				priority: listTemplateIndex + 1,
				BoardId: board.id,
			}, transaction);
			return await Card.bulkCreate(items.map((item, index) => {
				return {
					priority: index + 1,
					value: item,
					ListId: list.id,
				};
			}), transaction);
		}));
	}));
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
].forEach(t => t.sync({ force: false }));
