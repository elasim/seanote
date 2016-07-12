import { Router } from 'express';
import bodyParser from 'body-parser';

import APIDescriptors from './api-descriptors';
import Stream from './stream';
import Bulk from './bulk';

const router = new Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use((req, res, next) => {
	res.set('Cache-Control', 'no-cache');
	next();
});

for (let keyPath in APIDescriptors) {
	const methods = APIDescriptors[keyPath];
	for (let method in methods) {
		let action;
		let middlewares;

		const actionInfo = methods[method];
		if (actionInfo instanceof Array) {
			action = actionInfo[actionInfo.length - 1];
			middlewares = actionInfo.slice(0, actionInfo.length - 1);
		} else {
			action = actionInfo;
			middlewares = [];
		}

		router[method](keyPath, ...middlewares, async (req, res) => {
			try {
				const result = await action(req);
				return result ? res.json(result) : res.end();
			} catch (e) {
				console.error(e);
				return res.status(500).end();
			}
		});
	}
}

router.get('/stream', Stream);
router.post('/_bulk', Bulk);

router.use((error, req, res, next) => {
	res.status(500).json({ error: error.message });
});
router.use((req, res) => {
	res.status(404).json({ error: 'invalid request' });
});

export default router;
