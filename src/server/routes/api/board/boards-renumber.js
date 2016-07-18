import debug from 'debug';
import { Board } from '../../../data';
import sequelize from '../../../data/sequelize';
import requireAuth from '../middlewares/require-auth';
import HttpError from '../utils/http-error';

const TABLE = Board.getTableName();
const DEBUG_LOG_POST = debug('app.api.boards.renumber.post');

export default {
	post: [requireAuth, async (req) => {
		let author;
		if (req.body.author) {
			// if (!await RDAC.isWritable(req.user.db.id, req.body.author)) {
			// 	throw new HttpError('permission denied', 403);
			// } 
			author = req.body.author;
		} else {
			author = req.user.db.AuthorId;
		}
		DEBUG_LOG_POST('Renumbering for %s', author);
		await sequelize.query(`
			UPDATE ${TABLE}
			SET priority=(
				SELECT count(*) + 1.0
				FROM ${TABLE} B
				WHERE
					B.priority < ${TABLE}.priority
					and B.OwnerId = ${TABLE}.OwnerId
				)
			WHERE
				OwnerId='${author}'
		`);
	}],
};
