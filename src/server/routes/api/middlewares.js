import { verifyToken } from '../../lib/session';
import { User } from '../../data';

export async function requireAuth(req, res, next) {
	if (req.user) {
		if (req.query.token) {
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
			console.error('api token failure', e);
			return next(new Error('invalid token'));
		}
	} else {
		return next(new Error('authentication required'));
	}
}
