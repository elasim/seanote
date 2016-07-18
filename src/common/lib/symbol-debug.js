if (process.env.NODE_ENV === 'production') {
	module.exports = Symbol;
} else {
	module.exports = (a) => a;
}
