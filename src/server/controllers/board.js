import Sequelize from 'sequelize';
import Validator from 'validator';
import validate from './validation';
import { Boards, BoardSorts, BoardPrivacySettings } from '../data/schema/board';
import { Users } from '../data/schema/user';
import { Groups, GroupUsers } from '../data/schema/group';
import sequelize from '../data/sequelize';

const debug = require('debug')('app.BoardController');

const VALID_NAME_MAX = 140;
const VALID_PRIORITY_MIN = Number.EPSILON;

const TBL_BOARDS = Boards.getTableName();
const TBL_BOARD_SORTS = BoardSorts.getTableName();
const TBL_BOARD_PRIVACIES = BoardPrivacySettings.getTableName();
const TBL_USERS = Users.getTableName();
const TBL_GROUPS = Groups.getTableName();
const TBL_GROUP_USERS = GroupUsers.getTableName();
// Use raw SQL to get list (sequelize doesn't supports complex sub-query)
const QUERY_BODY_GET_LIST = `
	FROM
		${TBL_BOARDS} B
		LEFT OUTER JOIN
			${TBL_BOARD_PRIVACIES} BP ON B.id = BP.BoardId
		LEFT OUTER JOIN
			${TBL_BOARD_SORTS} BS ON B.id = BS.BoardId
	WHERE
		OwnerId = (
			SELECT AuthorId FROM ${TBL_USERS} U WHERE id = :UserId
		)
		OR B.id IN (
			SELECT BoardId FROM ${TBL_GROUPS} G WHERE id in (
				SELECT
					GroupId
				FROM ${TBL_GROUP_USERS} GU
				WHERE GU.UserId = :UserId
			)
		)
`;
const QUERY_RENUMBER = `
	UPDATE ${TBL_BOARD_SORTS}
	SET priority=(
		SELECT count(*) + 1.0
		FROM ${TBL_BOARD_SORTS} B
		WHERE
			B.priority < ${TBL_BOARD_SORTS}.priority
			and B.UserId = ${TBL_BOARD_SORTS}.UserId
		)
	WHERE
		UserId=:UserId
`;

export default new class BoardController {
	async canRead(user, board) {
		await validate(Validator.isUUID, board, 4);
		const count = await Boards.count({
			where: {
				id: board,
			},
			include: [{
				model: BoardPrivacySettings,
				as: 'PrivacySetting',
				where: {
					roleId: {
						$in: [
							user.PublisherId,
							...(await user.getGroups()).map(group => group.PublisherId),
						],
					},
					rule: 'read'
				}
			}]
		});
		debug('canRead() sorts.count %s', count);
		return count === 1;
		// If the request is valid,
		// BoardSorts must be exists
		// const count = await BoardSorts.count({
		// 	where: {
		// 		UserId: user.id,
		// 		BoardId: board
		// 	}
		// });
		// debug('canRead() sorts.count %s', count);
		// return count === 1;
		const privacy = await BoardPrivacySettings.find({
			where: {
				BoardId: board,
				readables: {
					$like: `%${user.id}%`
				}
			}
		});
		return !!privacy;
	}
	async haveWritePermission(user, board) {
		const privacy = await BoardPrivacySettings.find({
			where: {
				BoardId: board,
				writables: {
					$like: `%${user.id}%`
				}
			}
		});
		return !!privacy;
		// if (privacy.OwnerId === user.id) {
		// 	return true;
		// }
		// user.hasGroup()
		// if (privacy.Groups === BoardPrivacySettings.WRITE ) {
		// }
	}
	async create(user, { name, isPublic }, options = {}) {
		await validate(Validator.isLength, name, {
			min: 1,
			max: VALID_NAME_MAX,
		});
		await validate(value => {
			return typeof value === 'boolean';
		}, isPublic);

		const transaction = options.transaction || await sequelize.transaction();
		const t = { transaction };
		try {
			const count = await Boards.count(t);
			const board = await Boards.create({
				name,
				isPublic,
				PublisherId: user.PublisherId,
				AuthorId: user.id,
			}, t);
			await BoardPrivacySettings.bulkCreate([
				{
					BoardId: board.id,
					roleId: user.PublisherId,
					rule: 'write'
				},
				{
					BoardId: board.id,
					roleId: user.PublisherId,
					rule: 'read'
				}
			], t);
			const sort = await BoardSorts.create({
				UserId: user.id,
				BoardId: board.id,
				priority: count + 1,
			}, t);
			if (!options.transaction) {
				await transaction.commit();
			}
			return {
				...board.toJSON(),
				priority: sort.priority,
			};
		} catch (e) {
			debug(e);
			if (!options.transaction) {
				await transaction.rollback();
			}
			throw e;
		}
	}
	async update(user, { board, name, isPublic }) {
		await validate(Validator.isLength, name, {
			min: 1,
			max: VALID_NAME_MAX,
		});
		await validate(value => {
			return value === 0 || value === 1;
		}, isPublic);
		await validate(async value => {
			return await BoardSorts.count({
				where: {
					BoardId: value,
					UserId: user.id
				}
			}) === 1;
		}, board);

		return await Boards.update({
			name,
			isPublic,
		}, {
			where: {
				id: board
			}
		});
	}
	async delete(user, { board }) {
		await validate(async value => {
			return await BoardSorts.count({
				where: {
					BoardId: value,
					UserId: user.id
				}
			}) === 1;
		}, board);

		return await Boards.destroy({
			where: {
				BoardId: board
			},
			cascade: true
		});
	}
	async all(user, { offset, limit }) {
		await validate(value => {
			return Number.isInteger(value) && value >= 0;
		}, offset);
		await validate(value => {
			return Number.isInteger(value) && value >= 1 && value <= 100;
		}, limit);

		const paging = {
			offset: offset + (offset > 0 ? -1 : 0),
			limit: limit + (offset > 0 ? 2 : 1),
		};

		const transaction = await sequelize.transaction();
		let count;
		let boards;
		try {
			boards = await Boards.findAndCount({
				include: [{
					model: BoardPrivacySettings,
					as: 'PrivacySetting',
					where: {
						roleId: {
							$in: [
								user.PublisherId,
								...(await user.getGroups()).map(group => group.PublisherId),
							],
						},
						rule: 'read'
					}
				}]
			}, { transaction });
			// count = await sequelize.query(`
			// 	SELECT count(*) as count
			// 	${QUERY_BODY_GET_LIST}
			// `, {
			// 	type: Sequelize.QueryTypes.SELECT,
			// 	replacements: {
			// 		UserId: user.id
			// 	},
			// 	transaction,
			// });
			// boards = await sequelize.query(`
			// 	SELECT B.*, BS.priority
			// 	${QUERY_BODY_GET_LIST}
			// 	ORDER BY
			// 		BS.priority IS NOT NULL,
			// 		BS.priority ASC,
			// 		B.createdAt DESC
			// 	LIMIT
			// 		${paging.offset},
			// 		${paging.limit}
			// `, {
			// 	type: Sequelize.QueryTypes.SELECT,
			// 	replacements: {
			// 		UserId: user.id
			// 	},
			// 	transaction,
			// });
			for (let i = 0; i < boards.rows.length; ++i) {
				if (boards.rows[i].priority === null) {
					boards.rows[i].priority = i + 1;
					await BoardSorts.create({
						UserId: user.id,
						BoardId: boards.rows[i].id,
						priority: boards.rows[i].priority
					}, { transaction });
				}
			}
			await transaction.commit();
		} catch (e) {
			debug('all()', e);
			await transaction.rollback();
			throw e;
		}

		let prev;
		let next;

		// results contain the first item
		if (offset === 0 || boards.rows.length === 0) {
			prev = 0.0;
		} else {
			prev = boards.rows[0].priority;
			boards.rows.shift();
		}

		// results contain the last item
		if (paging.limit > boards.rows.length) {
			next = count + 1;
		} else {
			next = boards[boards.rows.length - 1].priority;
			boards.rows.pop();
		}

		return {
			items: boards.rows,
			prev,
			next,
			count: boards.count,
			offset: offset,
			limit: limit,
		};
	}
	async renumber(user) {
		const result = await sequelize.query(QUERY_RENUMBER, {
			type: Sequelize.QueryTypes.UPDATE,
			replacements: {
				UserId: user.id
			},
		});
		return result;
	}
	async sort(user, { BoardId, priority }) {
		await validate(Validator.isUUID, BoardId, 4);
		await validate(Validator.isFloat, priority, {
			min: VALID_PRIORITY_MIN
		});
		const transaction = sequelize.transaction();
		try {
			const sort = BoardSorts.findOne({
				BoardId,
				UserId: user.id,
			}, { transaction });
			// If this request is sent by normal use-case,
			// this data should be already created by all() method during display
			// in other cases, It was possibly abnormal request
			if (!sort) {
				throw new Error('invalid parameter');
			}
			sort.priority = priority;
			await sort.save({ transaction });
			await transaction.commit();
			return;
		} catch (e) {
			await transaction.rollback();
			throw e;
		}
	}
};
