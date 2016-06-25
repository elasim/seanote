if (process.env.BROWSER) {
	module.exports = require('./client').default;
} else {
	module.exports = require('./server').default;
}
