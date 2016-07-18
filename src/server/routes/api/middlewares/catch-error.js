export default function catchError(defaultStatusCode, defaultError) {
	return (error, req, res, next) => {
		res.status(error.statusCode || defaultStatusCode).json({
			error: error.message || defaultError
		});
	};
}
