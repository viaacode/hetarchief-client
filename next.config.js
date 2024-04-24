/* eslint-disable @typescript-eslint/no-var-requires, import/order */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

const path = require('path');
/*
 * next-transpile-modules is necessary because:
 * - Global CSS cannot be imported from within node_modules.
 *   Why: https://nextjs.org/docs/messages/css-npm
 *   RFC: https://github.com/vercel/next.js/discussions/27953
 */
const withTM = require('next-transpile-modules')(['ky-universal']);

const proxyUrl = process.env.PROXY_URL;
const { getI18n } = require('./next-i18next.config');

/** @type {import("next").NextConfig} */
module.exports = withBundleAnalyzer(
	withTM({
		i18n: getI18n(proxyUrl),
		// https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
		// Disabling react 18 strict mode, otherwise the zendesk widget is rendered twice
		reactStrictMode: false,
		experimental: {
			/**
			 * Necessary to prevent errors like:
			 * - Module not found: ESM packages (lodash-es) need to be imported.
			 *   Use 'import' to reference the package instead.
			 *   Solution: https://nextjs.org/docs/messages/import-esm-externals
			 */
			esmExternals: 'loose',
			/**
			 * https://stackoverflow.com/questions/72567320/typeerror-cannot-read-properties-of-null-reading-useref
			 */
			appDir: false,
			/**
			 * Ignore warnings about big page data, since we load translations like that
			 * https://meemoo.atlassian.net/browse/ARC-1932
			 */
			largePageDataBytes: 300 * 1000,
		},
		webpack: (config, options) => {
			// Required for ky-universal top level await used in admin core inside the api service
			config.experiments = { topLevelAwait: true, layers: true };

			// https://stackoverflow.com/a/68098547/373207
			config.resolve.fallback = { fs: false, path: false };

			// Fix issues with react-query:
			// https://github.com/TanStack/query/issues/3595#issuecomment-1276468579
			if (options.isServer) {
				config.externals = [
					'@tanstack/react-query',
					'use-query-params',
					...config.externals,
				];
			}
			config.resolve.alias = {
				...config.resolve.alias,
				['@tanstack/react-query']: path.resolve('./node_modules/@tanstack/react-query'),
				['use-query-params']: path.resolve('./node_modules/use-query-params'),
				['react-select']: path.resolve('./node_modules/react-select'),
				['react-select/creatable']: path.resolve('./node_modules/react-select/creatable'),
				['react-select/async']: path.resolve('./node_modules/react-select/async'),
				['react-popper']: path.resolve('./node_modules/react-popper'),
				['react-hook-form']: path.resolve('./node_modules/react-hook-form'),
				['react-table']: path.resolve('./node_modules/react-table'),
				['react-datepicker']: path.resolve('./node_modules/react-datepicker'),
				['react-page-split']: path.resolve('./node_modules/react-page-split'),
			};

			return config;
		},
		typescript: {
			tsconfigPath: './tsconfig.build.json',
		},
		images: {
			domains: [
				'assets-int.viaa.be',
				'assets-tst.viaa.be',
				'assets-qas.viaa.be',
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
		productionBrowserSourceMaps: true, // process.env.DEBUG_TOOLS === 'true',
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
		async headers() {
			if (
				process.env.PROXY_URL.includes('qas') ||
				process.env.PROXY_URL.includes('localhost')
			) {
				return [
					{
						source: '/',
						headers: [
							{
								key: 'X-Robots-Tag',
								value: 'noindex, nofollow, noarchive',
							},
						],
					},
					{
						source: '/(.*)',
						headers: [
							{
								key: 'X-Robots-Tag',
								value: 'noindex, nofollow, noarchive',
							},
						],
					},
				];
			}
			return [];
		},
		async redirects() {
			return [
				// Beheer redirects
				{
					source: '/beheer/aanvragen',
					destination: '/beheer/toegangsaanvragen',
					permanent: true,
				},
				// Admin redirects
				{
					source: '/admin/bezoekersruimtesbeheer/aanvragen',
					destination: '/admin/bezoekersruimtesbeheer/toegangsaanvragen',
					permanent: true,
				},
				// Account redirects
				{
					source: '/account',
					destination: '/account/mijn-profiel',
					permanent: true,
				},
				{
					source: '/account/mijn-historiek',
					destination: '/account/mijn-bezoek-historiek',
					permanent: true,
				},
				{
					source: '/bladwijzers',
					destination: '/account/mijn-mappen',
					permanent: true,
				},
				{
					source: '/gebruiker/profiel',
					destination: '/account/mijn-profiel',
					permanent: true,
				},
				// General redirects
				{
					source: '/home',
					destination: '/',
					permanent: true,
				},
				{
					source: '/faq',
					destination: '/vragen',
					permanent: true,
				},
				{
					source: '/handleiding',
					destination: '/vragen',
					permanent: true,
				},
				// Search redirects
				{
					source: '/catalog',
					destination: '/zoeken',
					permanent: true,
				},
				{
					source: '/catalog/:pid',
					destination: '/zoeken?zoekterm=:pid',
					permanent: true,
				},
				{
					source: '/catalog\\?f%5Bmedia_type_s\\%5D\\%5B\\%5D=video',
					destination: '/zoeken',
					permanent: true,
				},
				{
					source: '/catalog\\?utf8=\\%E2\\%9C\\%93&q=&search_field=all_fields&search_field=advanced&all_fields=hond',
					destination: '/zoeken',
					permanent: true,
				},
				{
					source: '/amsab/:slug',
					destination: '/zoeken/amsab-isg/:slug',
					permanent: true,
				},
				{
					source: '/amsab-isg/:slug',
					destination: '/zoeken/amsab-isg/:slug',
					permanent: true,
				},
				{
					source: '/advn/:slug',
					destination: '/zoeken/advn/:slug',
					permanent: true,
				},
				{
					source: '/kadoc/:slug',
					destination: '/zoeken/kadoc/:slug',
					permanent: true,
				},
			];
		},
	})
);
