import sequelize from '../data/sequelize';
import { Publishers } from '../data/schema/publisher';
import { Cards } from '../data/schema/card';
import { Lists } from '../data/schema/list';
import { Users, UserClaims, UserLogins, UserProfiles } from '../data/schema/user';
import Validator from 'validator';
import validate from './validation';
import boardCtrl from './board';
import UserDataTemplate from './user.template';

export default new class UserController {
	async getByClaim(provider, id) {
		return await UserClaims.findOne({
			where: {
				provider: 'facebook',
				id: id
			},
			include: [Users]
		});
	}
	async createWithClaim(provider, id, profile) {
		const transaction = await sequelize.transaction();
		const t = { transaction };
		try {
			const user = await createUserData(t, profile, UserDataTemplate);
			await UserClaims.create({
				UserId: user.id,
				provider,
				id: id,
			}, t);
			await transaction.commit();
			return Promise.resolve(user);
		} catch (e) {
			await transaction.rollback();
			throw e;
		}
	}
	async createWithLogin(context, id, pw) {
		const transaction = await sequelize.transaction();
		const t = { transaction };
		try {
			const user = await createUserData(t, {}, UserDataTemplate);
			await UserLogins.create({
				UserId: user.id,
				username: id,
				password: pw,
			}, t);
			await transaction.commit();
			return Promise.resolve(user);
		} catch (e) {
			await transaction.rollback();
			throw e;
		}
	}
};

async function createUserData(t, profiles, template) {
	const publisher = await Publishers.create({
		type: 'user'
	}, t);
	const user = await Users.create({
		PublisherId: publisher.id
	}, t);
	await UserProfiles.create({
		UserId: user.id,
		...profiles,
	}, t);
	await Promise.all(template.board.map(async (boardTemplate, boardTemplateIndex) => {
		const { list, ...props } = boardTemplate;
		const board = await boardCtrl.create(user, {
			name: props.name,
			isPublic: false,
		}, t);
		// const board = await Boards.create({
		// 	...props,
		// 	PublisherId: publisher.id,
		// 	OwnerId: user.id,
		// 	PrivacySettings: [
		// 		{ rule: 'read' },
		// 		{ rule: 'write' },
		// 	]
		// }, {
		// 	transaction: t.transaction,
		// 	include: [BoardPrivacySettings],
		// });
		// await BoardSorts.create({
		// 	priority: boardTemplateIndex + 1,
		// 	BoardId: board.id,
		// 	UserId: user.id,
		// }, t);
		return await Promise.all(list.map(async (listTemplate, listTemplateIndex) => {
			const { name, items } = listTemplate;
			const list = await Lists.create({
				name,
				priority: listTemplateIndex + 1,
				BoardId: board.id,
			}, t);
			return await Cards.bulkCreate(items.map((item, index) => {
				return {
					priority: index + 1,
					value: item,
					ListId: list.id,
				};
			}), t);
		}));
	}));
	return user;
}
