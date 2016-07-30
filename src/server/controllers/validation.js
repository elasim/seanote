import isEqual from 'lodash/isEqual';

const debug = require('debug')('app.validate');

class InvalidParameterError extends Error {
	constructor(message) {
		super(message);
	}
}

async function validate(predicate, ...params) {
	if (!await predicate(...params)) {
		throw new InvalidParameterError('invalid parameter');
	}
}

validate.isArrayOf = (value, type) => {
	return value instanceof Array
	&& value.reduce((acc, current) => {
		return acc = acc && (typeof current === type);
	}, true);
};
validate.isArrayWith = (value, predicate, ...args) => {
	return value instanceof Array
	&& value.reduce((acc, current) => {
		return acc = acc && predicate(current, ...args);
	}, true);
};
validate.isOneOf = (value, values) => {
	for (let i = 0; i < values.length; ++i) {
		if (isEqual(values[i], value)) {
			return true;
		}
	}
	return false;
};

export default validate;
 