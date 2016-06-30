import Rx from 'rx';
import jwt from 'jsonwebtoken';
import io from '../socket.io';

const clients = [];

io.on('connection', socket => {
	clients.push(socket);
	console.log('Clients remains: ', clients.length);

	socket.on('disconnect', () => {
		const idx = clients.indexOf(socket);
		clients.splice(idx, 1);

		console.log('Clients remains: ', clients.length);
	});
	// Rx.Observable.fromEvent(socket, 'request')
});

export default function (req, res, next) {
	if (req.body.token) {
		try {
			const decoded = jwt.verify(req.body.token, 'token-validation');
			req.token = decoded;
			next();
		} catch (er) {
			next(er);
		}
	}
}
