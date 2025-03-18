const HttpApi = require('i18next-http-backend');
const _ = require('lodash');

module.exports = {
	supportedLngs: ['nl', 'en'],
	i18n: {
		locales: ['nl', 'en'],
		defaultLocale: 'nl',
		localeDetection: false,
	},
	backend: {
		loadPath: `${process.env.PROXY_URL}/admin/translations/{{lng}}.json`,
		backendOptions: {
			expirationTime: 60 * 60 * 1000, // 1 hour
		},
	},
	use: [HttpApi],
	ns: ['common'],
	parseMissingKeyHandler: (key) => {
		if (key.includes('___')) {
			return `${_.upperFirst(_.lowerCase(key.split('___').pop()))} ***`;
		}
		return `${key} ***`;
	},
	debug: false,
};
