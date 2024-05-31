const I18NextHttpBackend = require('i18next-http-backend');
const _ = require('lodash');

function getI18n(proxyUrl) {
	return {
		locales: ['nl', 'en'],
		defaultLocale: 'nl',
		backend: {
			loadPath: `${proxyUrl}/admin/translations/{{lng}}.json`,
		},
		i18n: {
			locales: ['nl', 'en'],
			defaultLocale: 'nl',
			backend: {
				loadPath: `${proxyUrl}/admin/translations/{{lng}}.json`,
			},
		},
		use: [I18NextHttpBackend],
		ns: ['common', 'admin_core'],
		serializeConfig: false,
		parseMissingKeyHandler: (key) => {
			if (key.includes('___')) {
				return `${_.upperFirst(_.lowerCase(key.split('___').pop()))} ***`;
			}
			return `${key} ***`;
		},
		debug: false,
	};
}

module.exports = getI18n;
