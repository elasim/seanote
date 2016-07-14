import EventStream from '../../../lib/event-stream';

export default function(req, res) {
	if (!req.user) {
		return res.status(401).end();
	}
	const stream = EventStream.findOrCreate(req.user.claim.aud);
	stream.bind(req, res);
}
