
export function requireAuth(req, res, next) {
	if (!req.user && !req.query.token) {
		return next(new Error('authentication required'));
	}
	next();
}
