// eslint-disable-next-line @typescript-eslint/no-var-requires
const I18NextHttpBackend = require('i18next-http-backend');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

module.exports = {
	getI18n: (proxyUrl) => {
		return {
			defaultLocale: 'nl',
			locales: ['nl'],
			backend: {
				loadPath: `${proxyUrl}/translations/NL.json`,
			},
			i18n: {
				defaultLocale: 'nl',
				locales: ['nl'],
				backend: {
					loadPath: `${proxyUrl}/translations/NL.json`,
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
	},
};
