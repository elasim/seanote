
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

function createHandler(action) {
	return async (req, res, next) => {
		try {
			const result = await action(req);
			return result ? res.json(result) : res.end();
		} catch (e) {
			return next(e);
		}
	};
}