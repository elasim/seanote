import url from 'url';
import querystring from 'querystring';
import passport from 'passport';
import { createSession, veifySession } from '../../lib/session';

const debug = require('debug')('app.auth.passport');

// This function used to handle login return like OAuth
export function loginWithPassport(vender, req, res, next) {
	passport.authenticate(vender, (authError, user) => {
		if (authError) return failure(authError, req, res);
		if (!user) return failure(new Error('User data not found'), req, res);
		req.login(user, loginError => {
			if (loginError) return failure(loginError, req, res);
			return success(req, res);
		});
	})(req, res, next);
}

passport.serializeUser((user, done) => {
	debug('serializeUser()');
	if (!user) return done(new Error('User data not found'));
	done(null, createSession(user));
});

// session : { id, token }
passport.deserializeUser(async (session, done) => {
	debug('deserializeUser()');
	try {
		const { claim, user } = await veifySession(session);
		done(null, claim ? { ssid: session.id, claim, db: user } : null);
	} catch (e) {
		debug('session verification failed with Error', e);
		done(null, null);
	}
});

function success(req, res) {
	return redirect(req, res, null, '/');
}

function failure(error, req, res) {
	return redirect(req, res, { error: error.message }, '/signin');
}

function redirect(req, res, query, defaultRedirect = '/') {
	let base;
	if (req.session) {
		base = req.session.redirect || defaultRedirect;
	} else {
		base = defaultRedirect;
	}
	const urlObj = url.parse(base);
	const queries = querystring.parse(urlObj.query);
	Object.assign(queries, query);
	let redirect = urlObj.pathname;
	if (Object.getOwnPropertyNames(queries).length > 0) {
		redirect += '?' + querystring.stringify(queries);
	}
	// remove redirect value from session to futher use
	req.session.redirect = null;
	res.redirect(redirect);
}
