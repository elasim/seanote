if (process.env.BROWSER) {
	module.exports = require('./fake/data').default;
} else {
	module.exports = require('./impl/board').default;
}
