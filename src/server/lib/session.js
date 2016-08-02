import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import jwt from 'jsonwebtoken';
import { Users } from '../data';
import config from './config';

// @Refactors: Scalability, Security
// The reason I store user's token in memory is,
// Move this into external database to make server cluster
// Also, It should be placed in reliable memcached database
// to identify already used or not
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
		const user = await Users.findById(claim.id);
		if (!user) {
			console.log('Token verified, but User not exists');
			delete sessions[id];
			return false;
		}
		return { claim, user };
	} catch (e) {
		console.error(e);
		delete sessions[id];
		return false;
	}
}

export function extendSessionLife(sessionInfo) {
	try {
		return sessions[sessionInfo.ssid] = createToken({
			...sessionInfo.claim
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

export function createToken(user) {
	return jwt.sign({
		id: user.id,
		pid: user.PublisherId,
		role: user.role,
	}, keyPair.key, {
		algorithm: config.auth.jwt.algorithm,
		expiresIn: config.auth.jwt.exp,
		issuer: config.auth.jwt.iss,
	});
}

export function verifyToken(token) {
	return jwt.verify(token, keyPair.pub, {
		algorithms: [config.auth.jwt.algorithm],
		issuer: config.auth.jwt.iss,
	});
}

function getKeyPair() {
	const pathKey = path.join(__dirname, config.auth.jwt.privateKey);
	const pathPub = path.join(__dirname, config.auth.jwt.publicKey);
	return {
		key: fs.readFileSync(pathKey),
		pub: fs.readFileSync(pathPub),
	};
}
