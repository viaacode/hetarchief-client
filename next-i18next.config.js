// eslint-disable-next-line @typescript-eslint/no-var-requires
const I18NextHttpBackend = require('i18next-http-backend');

module.exports = {
	i18n: {
		defaultLocale: 'nl',
		locales: ['nl'],
		backend: {
			loadPath: `http://localhost:3100/translations/nl.json`,
		},
	},
	use: [I18NextHttpBackend],
	ns: ['common', 'admin_core'],
	serializeConfig: false,
	parseMissingKeyHandler: (key) => {
		if (key.includes('___')) {
			return `${key.split('___').pop()} ***`;
		}
		return `${key} ***`;
	},
	debug: true,
};
