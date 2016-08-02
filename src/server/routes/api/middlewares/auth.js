import debug from 'debug';
import HttpError from '../utils/http-error';
import { verifyToken } from '../../../lib/session';
import { Users } from '../../../data';

const DEBUG_LOG = debug('app.api.auth');

export default async function requireAuth(req, res, next) {
	const { authorization } = req.headers;
	debug('header', authorization);
	if (!authorization) {
		return next(new HttpError('authentication required', 400));
	}
	try {
		const token = authorization.match(/Bearer (.+)/)[1];
		const claim = await verifyToken(token);
		const db = await Users.findById(claim.aud);
		req.user = { claim, db };
		req.token = token;
		next();
	} catch (e) {
		DEBUG_LOG('api token failure', e);
		return next(new HttpError('invalid token', 401));
	}
}
