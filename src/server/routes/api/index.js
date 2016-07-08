import { Router } from 'express';
import bodyParser from 'body-parser';

import Stream from './stream';
import User from './user';
import Board from './board';
import BoardList from './board-list';

const APIDescriptors = {
	'/stream': Stream,
	'/user': User,
	'/board': Board,
	'/board/list': BoardList,
};

const router = new Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

for (let keyPath in APIDescriptors) {
	const actionMethods = APIDescriptors[keyPath];
	for (let method in actionMethods) {
		const actionDescriptor = actionMethods[method];
		let handler;
		let middlewares = [];

		if (actionDescriptor instanceof Array) {
			handler = actionDescriptor[actionDescriptor.length - 1];
			middlewares = actionDescriptor.slice(0, actionDescriptor.length - 1);
		} else {
			handler = actionDescriptor;
		}
		router[method](
			keyPath,
			...middlewares,
			(req, res) => {
				console.log(req.originalUrl);
				return handler(req, res);
			}
		);
	}
}

router.get('_bulk', (req, res) => {
	// Rx.Observable.from(Object.keys(req.body))
	// 	.map((v, i) => {

	// 	})
	// Rx.Observable.flatMap(Rx.Observable.req.body)
	// .map(key => {
	// 	const [api, param] = req.body[key];
	// 	return { name: key, api, param };
	// });
	// Rx.Observable.from(requests)
	// 	.
	res.json({
		error: 'Not Implemented'
	});
});

router.use((error, req, res, next) => {
	res.status(500).json({ error: error.message });
});
router.use((req, res) => {
	res.status(404).json({ error: 'invalid request' });
});

export default router;
