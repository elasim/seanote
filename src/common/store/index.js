if (process.env.NODE_ENV === 'production') {
	exports.configureStore = require('./production').default;
} else {
	exports.configureStore = require('./development').default;
}
