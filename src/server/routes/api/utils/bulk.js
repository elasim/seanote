import url from 'url';
import qs from 'querystring';
import pathToRegexp from 'path-to-regexp';
import APIDescriptors from '../descriptors';

export default function (req, res) {
	const tasks = parseBody(req.body);

	executeBulkAction(req, res, tasks)
		.then(results => {
			const tagged = results.map((result, i) => {
				return { [tasks[i].tag]: result };
			});
			res.json(Object.assign.apply({}, tagged));
		})
		.catch(e => {
			if (e instanceof Error) {
				console.error(e);
				return res.status(500).json({ error: e.message });
			}
			if (typeof e === 'number') {
				return res.status(e).end();
			}
			res.status(500).json({
				error: 'internal server error',
			});
		});
}

function parseBody(body) {
	return Object.keys(body).map(tag => {
		const task  = { tag };
		const taskInfo = body[tag];
		let uri;
		if (taskInfo instanceof Array) {
			[uri, task.body] = taskInfo;
		} else {
			uri = taskInfo;
		}
		const parsed = url.parse(uri);
		task.api = parsed.pathname;
		if (parsed.query) {
			task.query = qs.parse(parsed.query);
		}
		return task;
	});
}

function executeBulkAction(req, res, tasks) {
	let middlewares, actions;
	try {
		[middlewares, actions] = getTaskSteps(tasks);
		if (!middlewares || !actions) {
			return Promise.reject(new Error('failed to parse bulk tasks'));
		}
	} catch (e) {
		return Promise.reject(e);
	}
	return new Promise(async (resolve, reject) => {
		try {
			await executeMiddlewareSteps(req, res, middlewares);
			const jobs = actions.map(action => action(req));
			return resolve(await Promise.all(jobs));
		} catch (e) {
			reject(e);
		}
	});
}

function executeMiddlewareSteps(req, res, middlewares) {
	return Promise.all(middlewares.map(middleware => {
		return new Promise((resolve, reject) => {
			middleware(req, res, (e, ...others) => {
				if (e) return reject(e);
				resolve(e, ...others);
			});
		});
	}));
}

const routeKeys = Object.keys(APIDescriptors);
const routeMatches = routeKeys.map(route => pathToRegexp(route));

function getTaskSteps(tasks) {
	const middlewares = [];
	const actions = [];
	for (let task of tasks) {
		const matchedAPIs = routeMatches.filter(pattern => pattern.test(task.api));
		if (matchedAPIs.length > 1) {
			throw new Error('ambiguous request');
		}
		if (matchedAPIs.length === 0) {
			throw new Error('invalid request');
		}
		const idx = routeMatches.indexOf(matchedAPIs[0]);
		const methods = APIDescriptors[routeKeys[idx]];
		if (!methods.get) {
			throw new Error('bulk api is unusable for this request');
		}
		const actionInfo = methods.get;
		if (actionInfo instanceof Array) {
			for (let i=0; i < actionInfo.length - 1; ++i) {
				const middleware = actionInfo[i];
				if (middlewares.indexOf(middleware) === -1) {
					middlewares.push(middleware);
				}
			}
			actions.push(actionInfo[actionInfo.length - 1]);
		} else {
			actions.push(actionInfo);
		}
	}
	return [
		middlewares,
		actions,
	];
}
