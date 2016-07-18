import debug from 'debug';

export default function configure(router, descriptors) {
	for (let route in descriptors) {
		const methods = descriptors[route];
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

			router[method](route, ...middlewares, createHandler(action));
		}
	}
}

const DEBUG_LOG_RESPONSE = debug('app.api.handler');
function createHandler(action) {
	return async (req, res, next) => {
		DEBUG_LOG_RESPONSE(req.originalUrl, req.params);
		try {
			const result = await action(req);
			return result ? res.json(result) : res.end();
		} catch (e) {
			DEBUG_LOG_RESPONSE(e.stack);
			return next(e);
		}
	};
}