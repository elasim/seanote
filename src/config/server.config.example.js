{
	"host": "127.0.0.1",
	"port": 443,
	"https": {
		"port": 8443,
		"cert": "./secrets/example.cert",
		"key": "./secrets/example.key"
	},
	"sequelize": {
		"connectionString": "sqlite://db.sqlite3"
	},
	"auth": {
		"jwt": {
			"iss": "issuer",
			"exp": 600,
			"algorithm": "HS256",
			"secret": "used-for-symmetric-cipher-algorithms",
			"privateKey": "used-for-RSA-algorithms",
			"publicKey": "used-for-RSA-algorithms"
		},
		"google": {
			"clientID": null,
			"clientSecret": null,
			"callbackURL": "https://example.com/auth/google-return"
		},
		"facebook": {
			"clientID": null,
			"clientSecret": null,
			"callbackURL": "https://example.com/auth/fb-return"
		}
	}
}