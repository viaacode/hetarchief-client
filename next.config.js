/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * next-transpile-modules is necessary because:
 * - Global CSS cannot be imported from within node_modules.
 *   Why: https://nextjs.org/docs/messages/css-npm
 *   RFC: https://github.com/vercel/next.js/discussions/27953
 */
const withTM = require('next-transpile-modules')([]);

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
	async rewrites() {
		return [
			{
				source: '/admin/:path*',
				destination: '/admin',
			},
		];
	},
	typescript: {
		tsconfigPath: './tsconfig.build.json',
	},
	images: {
		domains: ['assets.viaa.be'],
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
	},
});
