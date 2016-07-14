
export default class HttpError extends Error {
	constructor(message, code = 404) {
		super(message);
		this.statusCode = code;
	}
}
