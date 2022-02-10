/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * next-transpile-modules is necessary because:
 * - Global CSS cannot be imported from within node_modules.
 *   Why: https://nextjs.org/docs/messages/css-npm
 *   RFC: https://github.com/vercel/next.js/discussions/27953
 */
const withTM = require('next-transpile-modules')([]);

const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
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
	rewrites: () => [
		/**
		 * We need to proxy calls to our own proxy server to prevent cookies from not being set when
		 * authenticating
		 */
		{ source: '/api/proxy/:path*', destination: `${process.env.PROXY_URL}/:path*` },
	],
	typescript: {
		tsconfigPath: './tsconfig.build.json',
	},
	images: {
		domains: ['assets.viaa.be'],
	},
});
