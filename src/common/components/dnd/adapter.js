if (process.env.BROWSER) {
	module.exports = require('./adapter-browser').default;
} else {
	module.exports = function () {};
}
