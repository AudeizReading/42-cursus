export default () => ({
	mail: {
		service: process.env.MAILER_SERVICE || 'gmail',
		email: process.env.MAILER_EMAIL || 'example@example.fr',
		password: process.env.MAILER_PASSWORD || 'password',
	},
	test: process.env.NODE_ENV == 'test' || process.env.TEST == 'true' || false,
	secretJWT: process.env.SECRET_JWT || 'secret',
	port: process.env.PORT || 3000,
	swaggerUI: process.env.SWAGGER_UI_DOC == 'true' || false,
	frontendEmailValidateURL: process.env.FRONTEND_EMAIL_VALIDATE_URL || '',
	frontendEmailRecoveryURL: process.env.FRONTEND_EMAIL_RECOVERY_URL || '',
	frontendFontTitleURL: process.env.FRONTEND_FONT_TITLE_URL || '',
	frontendFontBodyURL: process.env.FRONTEND_FONT_BODY_URL || '',
	frontendFontEmphaseURL: process.env.FRONTEND_FONT_EMPHASE_URL || '',
	frontendEndUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
	oauth: {
		google: {
			secret: process.env.GOOGLE_SECRET,
			public: process.env.GOOGLE_PUBLIC,
			redirect_uri:
				process.env.GOOGLE_REDIRECT_URI ||
				'http://localhost:4200/api/oauth/google',
		},
		facebook: {
			secret: process.env.FACEBOOK_SECRET,
			public: process.env.FACEBOOK_PUBLIC,
			redirect_uri:
				process.env.FACEBOOK_REDIRECT_URI ||
				'http://localhost:4200/api/oauth/facebook',
		},
	},
	hereKey: process.env.HERE_API,
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 6379,
		password: process.env.REDIS_PASSWORD,
	},
});
