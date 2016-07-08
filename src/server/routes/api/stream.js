import EventStream from '../../lib/event-stream';

export default {
	get(req, res) {
		if (!req.user) {
			return res.status(401).end();
		}
		const stream = EventStream.findOrCreate(req.user.aud);
		stream.bind(req, res);
	}
};
