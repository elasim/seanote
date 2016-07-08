import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import jwt from 'jsonwebtoken';

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

export function veifySession(session) {
	const { id, token } = session;
	try {
		return verifyToken(token) || verifyToken(sessions[id]);
	} catch (e) {
		console.error(e);
		delete sessions[id];
		return false;
	}
}

export function refreshToken(sessionInfo) {
	try {
		return sessions[sessionInfo.ssid] = createToken({
			role: sessionInfo.claim.role,
			id: sessionInfo.claim.aud,
		});
	} catch (e) {
		return false;
	}
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
