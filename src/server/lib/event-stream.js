import { EventEmitter } from 'events';

const PADDING_2K = Buffer(2049).fill(0);
const streams = {};

class EventStream extends EventEmitter {
	constructor() {
		super();
		this.reset();
	}
	reset() {
		this.request = null;
		this.response = null;
		this.events = [];
		this.closed = true;

		this.nextEventId = 1;
		this.lastExpired = 0;
		this.expires = 120;
		this.retryTime = 10000;
	}
	bind(req, res) {
		if (!this.closed) {
			this::setDisconnect();
		}
		this.request = req;
		this.response = res;

		if (!req || !res) {
			return;
		}

		req.socket.setKeepAlive(true);
		res.set('content-type', 'text/event-stream');
		res.set('cache-control', 'no-cache');
		res.write(PADDING_2K);
		res.write(`retry: ${this.retryTime}\n`);

		req.on('close', this::setDisconnect);
		req.on('end', this::setDisconnect);
		this.closed = false;

		// Sending Comment to keep-alive connection
		this.sendingHeartbeat = setTimeout(() => {
			res.write(`comment: ${Date.now()/1000}\n`);
		}, 30 * 1000);

		const lastEventId = getLastEventId(req);
		if (lastEventId && this.events.length > 0) {
			// if the client reconnect within token expiry time,
			// send all events since last-event-id again.
			this.events
				.filter(event => event.id > lastEventId)
				.forEach(event => this::send(event));
		}
	}
	send(data, tag) {
		const event = {
			id: this.nextEventId++,
			data,
			tag,
		};
		// save event until expires to use when it requred with last-event-id
		this.events.push(event);
		this::send(event);

		// remove from buffer after expiry time
		setTimeout(this::shfitBuffer, this.expires);
	}

	static findOrCreate(uid) {
		if (!streams[uid]) {
			streams[uid] = new EventStream();
			streams[uid].on('end', () => {
				streams[uid].reset();
				delete streams[uid];
			});
		}
		return streams[uid];
	}
	static sendEvent(uid, data, event) {
		const stream = streams[uid];
		if (stream) {
			stream.send(data, event);
		}
	}
}

function getLastEventId(req) {
	return req.headers['last-event-id'] || req.query.lastEventId;
}

function send(event) {
	if (this._closed || !this.response) {
		return;
	}
	this.response.write(`id: ${event.id}\n`);
	if (event.tag) {
		this.response.write(`event: ${event.tag}\n`);
	}
	this.response.write(`data: ${JSON.stringify(event.data)}\n`);
}

function shfitBuffer() {
	const event = this.events.shift();
	if (event) {
		this.lastExpired = event.id;
	}
	this::checkEnd();
}

function setDisconnect() {
	this.request = null;
	this.response = null;
	this.closed = true;
	clearInterval(this.sendingHeartbeat);
	this::checkEnd();
}

function checkEnd() {
	if (this.closed && this.events.length === 0) {
		this.emit('end');
	}
}

export default EventStream;
