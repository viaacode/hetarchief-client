const HttpApi = require('i18next-http-backend');
const _ = require('lodash');

module.exports = {
	i18n: {
		locales: ['nl', 'en'],
		defaultLocale: 'nl',
		localeDetection: false,
	},
	backend: {
		loadPath: `${process.env.PROXY_URL}/admin/translations/{{lng}}.json`,
	},
	use: [HttpApi],
	ns: ['common'],
	serializeConfig: false,
	parseMissingKeyHandler: (key) => {
		if (key.includes('___')) {
			return `${_.upperFirst(_.lowerCase(key.split('___').pop()))} ***`;
		}
		return `${key} ***`;
	},
	debug: false,
};
