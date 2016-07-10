import path from 'path';

module.exports = {
	host: '0.0.0.0',
	port: 8000,
	https: {
		port: 8443,
		cert: require('./keystore/ssl.crt'),
		key: require('./keystore/ssl-insecure.key')
	},
	sequelize: {
		connectionString: 'sqlite://db.sqlite3'
	},
	odm: {
		connectionString: 'nedb://db.nedb'
	},
	auth: {
		jwt: {
			algorithm: 'RS256',
			iss: 'urn://auth.whitenull.com',
			exp: 300,
			privateKey: require('./keystore/auth.pem'),
			publicKey: require('./keystore/auth.pub')
		},
		google: {
			clientID: '767800562522-e54qitgo3nmgtt9b01dr8lfoo9646e8f.apps.googleusercontent.com',
			clientSecret: '1yhoW6BT-qPm3OUwYc8zjNw6',
			callbackURL: 'https://localhost:3000/auth/google-return'
		},
		facebook: {
			clientID: '1112422838821911',
			clientSecret: '57604d28da42439765e71d5e0783afe7',
			callbackURL: 'https://localhost:3000/auth/fb-return'
		}
	}
};
