
class ValidationError extends Error {
	constructor(message) {
		super(message);
	}
}

export default async function validate(predicate, ...params) {
	if (!await predicate(...params)) {
		throw new ValidationError('validation error');
	}
}
