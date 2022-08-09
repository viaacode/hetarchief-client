/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * next-transpile-modules is necessary because:
 * - Global CSS cannot be imported from within node_modules.
 *   Why: https://nextjs.org/docs/messages/css-npm
 *   RFC: https://github.com/vercel/next.js/discussions/27953
 */
const withTM = require('next-transpile-modules')([
	'@meemoo/react-admin',
	'@viaa/avo2-components',
	'ky-universal',
]);

const { i18n } = require('./next-i18next.config');

/** @type {import("next").NextConfig} */
module.exports = withTM({
	i18n,
	reactStrictMode: true,
	experimental: {
		/**
		 * Necessary to prevent errors like:
		 * - Module not found: ESM packages (lodash-es) need to be imported.
		 *   Use 'import' to reference the package instead.
		 *   Solution: https://nextjs.org/docs/messages/import-esm-externals
		 */
		esmExternals: 'loose',
	},
	webpack: (config) => {
		// Required for ky-universal top level await used in admin core inside the api service
		config.experiments = { topLevelAwait: true, layers: true };
		return config;
	},
	typescript: {
		tsconfigPath: './tsconfig.build.json',
	},
	images: {
		domains: [
			'assets.viaa.be',
			'assets-int.hetarchief.be',
			'assets-tst.hetarchief.be',
			'assets-qas.hetarchief.be',
			'assets.hetarchief.be',
			'media-int.viaa.be',
			'media-tst.viaa.be',
			'media-qas.viaa.be',
			'media.viaa.be',
		],
	},
	productionBrowserSourceMaps: process.env.DEBUG_TOOLS === 'true',
	publicRuntimeConfig: {
		NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED,
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT,
		CLIENT_URL: process.env.CLIENT_URL,
		SSUM_EDIT_ACCOUNT_URL: process.env.SSUM_EDIT_ACCOUNT_URL,
		PROXY_URL: process.env.PROXY_URL,
		DEBUG_TOOLS: process.env.DEBUG_TOOLS,
		ZENDESK_KEY: process.env.ZENDESK_KEY,
		FLOW_PLAYER_TOKEN: process.env.FLOW_PLAYER_TOKEN,
		FLOW_PLAYER_ID: process.env.FLOW_PLAYER_ID,
		GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
	},
});
