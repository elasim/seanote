import { Router } from 'express';
import EventStream from '../../lib/event-stream';

const router = new Router();

const streams = {};

router.get('/stream', (req, res) => {
	if (!req.user) {
		return res.status(401).end();
	}
	console.log('session-id', req.session.id);
	const uid = req.user.aud;
	// previous session was not expired
	if (!streams[uid]) {
		streams[uid] = new EventStream();
		streams[uid].on('end', () => terminateStream(uid));
	}
	const stream = streams[uid];

	stream.bind(req, res);
});

function terminateStream(uid) {
	streams[uid].reset();
	streams[uid] = undefined;
}

export default router;
export function sendEvent(uid, data, event) {
	const stream = streams[uid];
	if (stream) {
		stream.send(data, event);
	}
}
