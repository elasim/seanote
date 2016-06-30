import { Router } from 'express';
import getParameterNames from 'get-parameter-names';

export class Controller {
	_router = new Router();
	constructor(type, ...middlewares) {
		const router = this._router;
		const actionMetadata = getActionMetadataList(type);
		for (let actionMeta of actionMetadata) {
			const {
				action,
				generator,
				method,
				routePath,
			} = actionMeta;
			router[method](routePath, ...middlewares, generator(this::action));
		}
	}
	get router() {
		return this._router;
	}
}

export const ActionResult = {
	json: (value) => (res) => res.json(value),
};

const QUERY_PATTERN = /^(get|delete)(?:(?:By([A-z]+)$)|(?:([A-Z]\w+)By([A-Z]\w+)$)|([A-Z]\w+)$|$)/;
const INSERT_PATTERN = /^(post|put)(?:(?:With([A-z]+)$)|(?:([A-Z]\w+)With([A-Z]\w+)$)|([A-Z]\w+)$|$)/;

/**
 * @return array({
 *	action : function - action handler
 *	generator : function - request callback generator
 *	method : string - HTTP method
 *	routePath : string - route path
 * })
 */
function getActionMetadataList(controllerType) {
	const { prototype } = controllerType;
	return Object.getOwnPropertyNames(prototype)
		.filter(prop => (
			prototype[prop] instanceof Function && prop !== 'constructor'
		))
		.map(prop => ({
			name: prop,
			pattern: prop.match(QUERY_PATTERN) || prop.match(INSERT_PATTERN)
		}))
		.filter(prop => !!prop.pattern)
		.map(action => {
			// group1 ^(get|delete) or ^(post|put)
			const method = action.pattern[1];
			const params = getParameterNames(prototype[action.name]);
			let data;
			let key;
			// let generator; // to reduce overhead per every request

			if (action.pattern[2]) {
				// group2.1 By([A-z]+)$ or With([A-z]+)$
				key = action.pattern[2].toLowerCase();
				// generator = getQueryCallbackGenerator(method, params, key);
			} else if (action.pattern[3] && action.pattern[4]) {
				// group2.2 ([A-Z]\w+)By([A-Z]\w+)$ or ([A-Z]\w+)With([A-Z]\w+)$
				key = action.pattern[4].toLowerCase();
				data = action.pattern[3];
				// generator = getDataQueryCallbackGenerator(method, params, key, data);
			} else if (action.pattern[5]) {
				// group2.3 ([A-Z]\w+)$
				data = action.pattern[5];
				// generator = getDataCallbackGenerator(method, params, data);
			} else {
				// group2.4 $
				// generator = getCallbackGenerator(method, params);
			}

			return {
				action: prototype[action.name],
				generator: getCallbackGenerator(method, data, key, params),
				method,
				routePath: '/' + (key ? `:${key}/` : '') + (data || ''),
			};
		});
}

// According to RFC2616.Section4-3
// "A server SHOULD read and forward a message-body on any request"
// So, it forwards message body to action on any request
//
// * Hypertext Transfer Protocol -- HTTP/1.1
// https://tools.ietf.org/html/rfc2616#section-4.3

// leave method parameter to keep code consistency
function getCallbackGenerator(method, data, key, params) {
	return (action) => async (req, res, next) => {
		if (key && !req[key]) {
			return next();
		}
		const actionParams = params.map(param => req[param]);
		try {
			const actionResult = await action(...actionParams);
			return actionResult(res);
		} catch (e) {
			next(e);
		}
	};
}

// function getDataCallbackGenerator(method, params, data) {
// 	return (action) => async (req, res) => {
// 		const actionResult = await action(req.query, req.body);
// 	};
// }

// function getDataQueryCallbackGenerator(method, params, key, data) {
// }

// function getQueryCallbackGenerator(method, params, key) {
// }
