
if (process.env.BROWSER) {
	require('./universal-db.client.js');
} else {
	require('./universal-db.server.js');
}
