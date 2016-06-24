if (process.env.BROWSER) {
	module.exports = require('./fake/user').default;
} else {
	module.exports = require('./impl/user').default;
}
