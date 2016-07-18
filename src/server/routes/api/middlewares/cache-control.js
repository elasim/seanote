export default function cacheControl(value) {
	return (req, res, next) => {
		res.set('Cache-Control', value);
		next();
	};
}
