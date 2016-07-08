import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import jwt from 'jsonwebtoken';
import { User } from '../data';
import { auth as config } from '../../config.json';

// @Note: Scalability
// Move this into external database to make server cluster
const sessions = {};
const keyPair = getKeyPair();

export function createSession(user) {
	try {
		const token = createToken(user);
		let id;
		do {
			id = uuid.v4();
			if (sessions[id]) continue;
			sessions[id] = token;
		} while (!sessions[id]);
		return { id, token };
	} catch (e) {
		console.error(e);
		return null;
	}
}

export async function veifySession(session) {
	const { id, token } = session;
	try {
		const claim = verifyToken(token) || verifyToken(sessions[id]);
		// Token verification can used to check session expiry, user role and user id.
		// but, It doesn't means about that the user is actually exist.
		// User data could be deleted during session is still active.
		// In this case, verification must be failed.
		const user = await User.findById(claim.aud);
		if (!user) {
			console.log('Token verified, but User not exists');
			return false;
		}
		return claim;
	} catch (e) {
		console.error(e);
		delete sessions[id];
		return false;
	}
}

export function extendSessionLife(sessionInfo) {
	try {
		return sessions[sessionInfo.ssid] = createToken({
			role: sessionInfo.claim.role,
			id: sessionInfo.claim.aud,
		});
	} catch (e) {
		return false;
	}
}

// EXPRESS-MIDDLEWARE
export function connectJwtSession(req, res, next) {
	if (req.user) {
		const newToken = extendSessionLife(req.user);
		if (newToken) {
			console.log(req.user.ssid, ': new token issued');
			req.session.passport.user.token = newToken;
		} else {
			console.log(req.user.ssid, ': token expired');
			req.session = null;
		}
	}
	return next();
}

function createToken(user) {
	return jwt.sign({ role: user.role }, keyPair.key, {
		algorithm: config.jwt.algorithm,
		expiresIn: config.jwt.exp,
		issuer: config.jwt.iss,
		audience: user.id
	});
}

function verifyToken(token) {
	if (!token) return;
	try {
		return jwt.verify(token, keyPair.pub, {
			algorithms: [config.jwt.algorithm],
			issuer: config.jwt.iss,
		});
	} catch (e) {
		return false;
	}
}

function getKeyPair() {
	const pathKey = path.join(process.cwd(), config.jwt.privateKey);
	const pathPub = path.join(process.cwd(), config.jwt.publicKey);
	return {
		key: fs.readFileSync(pathKey),
		pub: fs.readFileSync(pathPub),
	};
}
