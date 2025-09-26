/* eslint-disable @typescript-eslint/no-var-requires, import/order */
// const bundleAnalyser = require('@next/bundle-analyzer');
/*
 * next-transpile-modules is necessary because:
 * - Global CSS cannot be imported from within node_modules.
 *   Why: https://nextjs.org/docs/messages/css-npm
 *   RFC: https://github.com/vercel/next.js/discussions/27953
 */
const nextTranspileModules = require('next-transpile-modules');
const path = require('node:path');

// const withBundleAnalyzer = bundleAnalyser({
// 	enabled: process.env.ANALYZE === 'true',
// });

const withTM = nextTranspileModules([
	'ky-universal',
	'@viaa/avo2-components',
	'@meemoo/react-components',
]);

/** @type {import("next").NextConfig} */
// module.exports = withBundleAnalyzer(
module.exports = withTM({
	i18n: {
		locales: ['nl', 'en'],
		defaultLocale: 'nl',
		localeDetection: false,
	},
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
		 * Ignore warnings about big page data, since we load translations like that
		 * https://meemoo.atlassian.net/browse/ARC-1932
		 */
		largePageDataBytes: 300 * 1000,

		// Attempt to improve css loading
		// https://meemoo.atlassian.net/browse/ARC-2913
		optimizeCss: true,
	},
	eslint: {
		ignoreDuringBuilds: true, // We're using biome instead of eslint
	},
	webpack: (config, options) => {
		config.mode = 'production';

		// Required for ky-universal top level await used in admin core inside the api service
		config.experiments = { topLevelAwait: true, layers: true };

		// https://stackoverflow.com/a/68098547/373207
		config.resolve.fallback = { fs: false, path: false };

		// Fix issues with react-query:
		// https://github.com/TanStack/query/issues/3595#issuecomment-1276468579
		if (options.isServer) {
			config.externals = ['@tanstack/react-query', 'use-query-params', ...config.externals];
		}

		// Use biome linting instead of eslint for the build
		config.plugins.push(
			new (require('webpack').DefinePlugin)({
				'process.env.BIOME_LINT': JSON.stringify(true),
			})
		);

		// Ignore NextJS warnings about skipped css rules that are not compatible with server side rendering
		// https://meemoo.atlassian.net/browse/ARC-3192
		config.ignoreWarnings = [
			{ message: /rules skipped due to selector errors/i },
			{ message: /Empty sub-selector/i },
		];

		// Ensure certain packages are always resolved to one version instead of other versions from admin-core or component libraries
		config.resolve.alias = {
			...config.resolve.alias,
			'@tanstack/react-query': path.resolve('./node_modules/@tanstack/react-query'),
			'use-query-params': path.resolve('./node_modules/use-query-params'),
			'react-select': path.resolve('./node_modules/react-select'),
			'react-select/creatable': path.resolve('./node_modules/react-select/creatable'),
			'react-select/async': path.resolve('./node_modules/react-select/async'),
			'react-popper': path.resolve('./node_modules/react-popper'),
			'react-hook-form': path.resolve('./node_modules/react-hook-form'),
			'react-table': path.resolve('./node_modules/react-table'),
			'react-datepicker': path.resolve('./node_modules/react-datepicker'),
			'react-page-split': path.resolve('./node_modules/react-page-split'),
			lodash$: path.resolve('./node_modules/lodash-es'),
		};

		return config;
	},
	typescript: {
		tsconfigPath: './tsconfig.build.json',
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.viaa.be',
			},
			{
				protocol: 'https',
				hostname: '**.hetarchief.be',
			},
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
		ENABLE_GOOGLE_INDEXING: process.env.ENABLE_GOOGLE_INDEXING,
		IIIF_IMAGE_API: process.env.IIIF_IMAGE_API,
	},
	async headers() {
		if (process.env.ENABLE_GOOGLE_INDEXING === 'false') {
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
			// CP admin redirects
			{
				source: '/beheer/aanvragen',
				destination: '/beheer/toegangsaanvragen',
				permanent: true,
			},
			// Admin redirects
			{
				// Only the dutch redirect, since that was the only language that existed at the time
				source: '/admin/bezoekersruimtesbeheer/aanvragen',
				destination: '/beheer/toegangsaanvragen',
				permanent: true,
			},
			{
				source: '/admin/content',
				destination: '/admin/content-paginas',
				permanent: true,
			},
			{
				source: '/admin/content/:path*',
				destination: '/admin/content-paginas/:path*',
				permanent: true,
			},
			// Account redirects
			{
				// Only the dutch redirect, since that was the only language that existed at the time
				source: '/account',
				destination: '/account/mijn-profiel',
				permanent: true,
			},
			{
				// Only the dutch redirect, since that was the only language that existed at the time
				source: '/account/mijn-historiek',
				destination: '/account/mijn-bezoek-historiek',
				permanent: true,
			},
			{
				// Only the dutch redirect, since that was the only language that existed at the time
				source: '/bladwijzers',
				destination: '/account/mijn-mappen/favorieten',
				permanent: true,
			},
			{
				source: '/account/mijn-mappen',
				destination: '/account/mijn-mappen/favorieten',
				permanent: true,
			},
			{
				source: '/account/my-folders',
				destination: '/account/my-folders/favorites',
				permanent: true,
			},
			{
				// Only the dutch redirect, since that was the only language that existed at the time
				source: '/gebruiker/profiel',
				destination: 'account/mijn-profiel',
				permanent: true,
			},
			// General redirects
			{
				source: '/home',
				destination: '/',
				permanent: true,
			},
			{
				// Only the dutch redirect, since that was the only language that existed at the time
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
				source:
					'/catalog\\?utf8=\\%E2\\%9C\\%93&q=&search_field=all_fields&search_field=advanced&all_fields=hond',
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
			// Keep the redirects below until 01/01/2026: https://meemoo.atlassian.net/browse/ARC-2659
			// de-wereld-van-kina => kina
			{
				source: '/bezoek/de-wereld-van-kina/:path*',
				destination: '/bezoek/kina/:path*',
				permanent: true,
			},
			{
				source: '/zoeken/de-wereld-van-kina/:path*',
				destination: '/zoeken/kina/:path*',
				permanent: true,
			},
			{
				source: '/zoeken',
				has: [
					{
						type: 'query',
						key: 'aanbieder',
						value: 'de-wereld-van-kina',
					},
				],
				destination: '/zoeken?aanbieder=kina',
				permanent: true,
			},
			// ring-tv => ring
			{
				source: '/bezoek/ring-tv/:path*',
				destination: '/bezoek/ring/:path*',
				permanent: true,
			},
			{
				source: '/zoeken/ring-tv/:path*',
				destination: '/zoeken/ring/:path*',
				permanent: true,
			},
			{
				source: '/zoeken',
				has: [
					{
						type: 'query',
						key: 'aanbieder',
						value: 'ring-tv',
					},
				],
				destination: '/zoeken?aanbieder=ring',
				permanent: true,
			},
			// ku-leuven-limel => ku-leuven-dienst-onderwijs
			{
				source: '/bezoek/ku-leuven-limel/:path*',
				destination: '/bezoek/ku-leuven-dienst-onderwijs/:path*',
				permanent: true,
			},
			{
				source: '/zoeken/ku-leuven-limel/:path*',
				destination: '/zoeken/ku-leuven-dienst-onderwijs/:path*',
				permanent: true,
			},
			{
				source: '/zoeken',
				has: [
					{
						type: 'query',
						key: 'aanbieder',
						value: 'ku-leuven-limel',
					},
				],
				destination: '/zoeken?aanbieder=ku-leuven-dienst-onderwijs',
				permanent: true,
			},
			// Keep the redirects above  until 01/01/2026: https://meemoo.atlassian.net/browse/ARC-2659
			// ku-leuven-universiteitsbibliotheek => ku-leuven-universiteitsbibliotheken
			{
				source: '/bezoek/ku-leuven-universiteitsbibliotheek/:path*',
				destination: '/bezoek/ku-leuven-universiteitsbibliotheken/:path*',
				permanent: true,
			},
			{
				source: '/zoeken/ku-leuven-universiteitsbibliotheek/:path*',
				destination: '/zoeken/ku-leuven-universiteitsbibliotheken/:path*',
				permanent: true,
			},
			{
				source: '/zoeken',
				has: [
					{
						type: 'query',
						key: 'aanbieder',
						value: 'ku-leuven-universiteitsbibliotheek',
					},
				],
				destination: '/zoeken?aanbieder=ku-leuven-universiteitsbibliotheken',
				permanent: true,
			},
		];
	},
});
