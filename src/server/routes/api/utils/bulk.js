import URL from 'url';
import qs from 'qs';
import pathToRegexp from 'path-to-regexp';
import ndJSON from 'ndjson';
import debug from 'debug';
import HttpError from './http-error';
import edges from '../edges';

const apiRoutes = Object.keys(edges);
const apiRoutePatterns = apiRoutes.map(route => {
	const opt = {};
	const keys = [];
	if (/\/$/.test(route)) {
		opt.end = false;
	}
	return {
		regexp: pathToRegexp(route, keys, opt),
		keys,
	};
});

const DEBUG_LOG_BULK_REQUEST = debug('app.api.bulk.request');
export default function (req, res, next) {
	if (req.headers['content-type'] !== 'application/vnd.seanote.stream+json') {
		return next();
	}

	let parseError = null;
	const tasks = [];

	req.pipe(ndJSON.parse({ strict: true }))
		.on('data', data => tasks.push(parse(data)))
		.on('error', e => {
			DEBUG_LOG_BULK_REQUEST('Failure');
			DEBUG_LOG_BULK_REQUEST(e);
			parseError = e;
		})
		.on('end', () => {
			if (!parseError) process.nextTick(proceed);
			else next(new HttpError('invalid requeset', 400));
		});

	async function proceed() {
		try {
			await Promise.all(tasks);
			DEBUG_LOG_BULK_REQUEST('Begin');
			DEBUG_LOG_BULK_REQUEST('Excuting Tasks');
			const results = await Promise.all(tasks.map(async task => {
				const { url, query, body, params } = task;
				const taskReq = { ...req, query, body, params };
				if (task.middlewares) {
					DEBUG_LOG_BULK_REQUEST('Excuting Middlewares');
					await executeMiddlewares(task.middlewares, taskReq, res);
				}
				DEBUG_LOG_BULK_REQUEST('Run', url);
				return await task.api(taskReq);
			}));
			res.json({ results });
		} catch (e) {
			return next(e);
		}
	}
}

const DEBUG_LOG_PARSE = debug('app.api.bulk.parse');
function parse(request) {
	DEBUG_LOG_PARSE(request);
	const url = Object.keys(request)[0];
	let method;
	let body;
	if (request[url] instanceof Array) {
		[method, body] = request[url];
	} else {
		method = request[url];
		body = {};
	}

	const result = {};

	for (let i = 0; i  < apiRoutePatterns.length; ++i) {
		const { regexp, keys } = apiRoutePatterns[i];
		const parsedUrl = URL.parse(url);
		const match = regexp.exec(parsedUrl.pathname);
		DEBUG_LOG_PARSE(match, parsedUrl.pathname);
		if (!match) continue;

		const apiDesc = edges[apiRoutes[i]][method];
		if (apiDesc) {
			result.params = keys.reduce((params, { name }, index) => {
				DEBUG_LOG_PARSE(index, name, match[index+1]);
				if (match[index + 1]) {
					params[name] = match[index + 1];
				}
				return params;
			}, {});
			result.body = body;
			result.query = qs.parse(parsedUrl.query);
			result.url = url;
			DEBUG_LOG_PARSE(result);
			if (apiDesc instanceof Array) {
				result.middlewares = [...apiDesc];
				result.api = result.middlewares.pop();
			} else {
				result.middlewares = null,
				result.api = apiDesc;
			}
			return result;
		}
	}
	return Promise.reject(new HttpError(`unknown request : ${url}`, 400));
}

function executeMiddlewares(middlewares, req, res) {
	return Promise.all(middlewares.map(middleware => {
		return executeMiddlewareStep(middleware, req, res);
	}));
}

function executeMiddlewareStep(middleware, req, res) {
	return new Promise((resolve, reject) => {
		middleware(req, res, (e, ...others) => {
			if (e) return reject(e);
			resolve(e, ...others);
		});
	});
}
