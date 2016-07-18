import debug from 'debug';
import { verifyToken } from '../../../lib/session';
import { User } from '../../../data';

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
			const db = await User.findById(claim.aud);
			req.user = { claim, db };
			next();
		} catch (e) {
			DEBUG_LOG('api token failure', e);
			return next(new Error('invalid token'));
		}
	} else {
		return next(new Error('authentication required'));
	}
}
