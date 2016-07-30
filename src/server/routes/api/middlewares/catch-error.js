const debug = require('debug')('app.api.error');

export default function catchError(defaultStatusCode, defaultError) {
	return (error, req, res, next) => {
		debug(error);
		res.status(error.statusCode || defaultStatusCode).json({
			error: error.message || defaultError
		});
	};
}
