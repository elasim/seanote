if (process.env.BROWSER) {
	module.exports = require('./fake/board').default;
} else {
	module.exports = require('./impl/board').default;
}
