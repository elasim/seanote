import debug from 'debug';
import HttpError from '../utils/http-error';
import { verifyToken } from '../../../lib/session';
import { Users } from '../../../data';

const DEBUG_LOG = debug('app.api.middleware.requireAuth');

export default async function requireAuth(req, res, next) {
	if (req.user) {
		if (req.query.token) {
			DEBUG_LOG('fail: Token provided with Session');
			return next(new Error('You are already logged, but token was served'));
		}
		return next();
	} else if (req.query.token) {
		try {
			const claim = await verifyToken(req.query.token);
			const db = await Users.findById(claim.aud);
			req.user = { claim, db };
			next();
		} catch (e) {
			DEBUG_LOG('api token failure', e);
			return next(new HttpError('invalid token', 401));
		}
	} else {
		return next(new HttpError('authentication required', 400));
	}
}
