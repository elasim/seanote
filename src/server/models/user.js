import crypto from 'crypto';
import Sequelize from 'sequelize';
import sequelize from '../data/sequelize';
import { Publishers } from '../data/schema/publisher';
import { Cards } from '../data/schema/card';
import { Lists } from '../data/schema/list';
import { Users, UserClaims, UserLogins, UserProfiles } from '../data/schema/user';
import Validator from 'validator';
import validate from './validation';
import Board from './board';
import UserDataTemplate from './user.template';

const debug = require('debug')('app.model.User');

export default new class User {
	getHash(key, salt) {
		const hasher = crypto.createHash('sha256');
		hasher.update(key);
		hasher.update(salt);
		return hasher.digest('hex');
	}
	async getByLogin(username, password) {
		await validate(Validator.isEmail, username, {
			require_tld: false
		});
		await validate(Validator.isLength, password, {
			min: 8,
			max: 255
		});
		const login = await UserLogins.findById(username, {
			include: [Users]
		});
		if (login) {
			const given = this.getHash(password, login.salt);
			if (given === login.password) {
				return login.User;
			}
		}
		return null;
	}
	async getByClaim(provider, id) {
		const claim = await UserClaims.find({
			where: {
				provider,
				id,
			},
			include: [Users]
		});
		return claim ? claim.User : null;
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
			return user;
		} catch (e) {
			await transaction.rollback();
			throw e;
		}
	}
	async createWithLogin(username, password, profile = {}) {
		debug('createWithLogin()', 'username', username, typeof username);
		debug('createWithLogin()', 'password', password, typeof password);
		const transaction = await sequelize.transaction();
		const t = { transaction };
		try {
			const user = await createUserData(t, profile, UserDataTemplate);
			const salt = crypto.randomBytes(32).toString('hex');
			await UserLogins.create({
				UserId: user.id,
				username: username,
				password: this.getHash(password, salt),
				salt,
			}, t);
			await transaction.commit();
			return user;
		} catch (e) {
			debug('createWithLogin()', e);
			await transaction.rollback();
			throw e;
		}
	}
};

async function createUserData(t, profiles, template) {
	debug('createUserData()');
	const pub = await Publishers.create({
		type: 'user',
		Users: [{
			role: 'user',
			UserProfile: profiles
		}],
	}, {
		transaction: t.transaction,
		include: [{
			model: Users,
			include: [UserProfiles]
		}],
	});
	const user = await Users.find({
		where: {
			PublisherId: pub.id
		},
		transaction: t.transaction,
	});
	for (let i = 0; i < template.board.length; ++i) {
		const { list, ...props } = template.board[i];
		await Board.create(user, {
			name: props.name,
			isPublic: 0,
			Lists: list.map((listTemplate, listTemplateIndex) => {
				const { name, items } = listTemplate;
				return {
					name: name,
					priority: listTemplateIndex + 1,
					Cards: items.map((cardTemplate, cardTemplateIndex) => {
						return {
							value: cardTemplate,
							priority: cardTemplateIndex + 1,
						};
					})
				};
			})
		}, {
			transaction: t.transaction,
			include: [{
				model: Lists,
				include: [Cards],
			}]
		});
	}
	return user;
}
