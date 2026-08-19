const path = require('node:path');

/**
 * Critters (invoked by Next for `experimental.optimizeCss` below) logs a "N rules skipped due to
 * selector errors" warning at build/request time: our browserslist config still resolves to some
 * very old browser targets (e.g. old iOS Safari), which makes postcss-preset-env/autoprefixer emit
 * legacy selector-list fallbacks (:lang() chains for logical properties, -webkit-any() for :is())
 * that Critters' selector parser can't understand. It only affects critical-CSS *inlining* -- the
 * full stylesheet still loads normally, so this is cosmetic noise, not a functional issue.
 * runtime doesn't consistently forward the object's fields to Critters), but this env var does --
 * it's Next's own documented escape hatch (see node_modules/next/dist/server/post-process.js).
 */
process.env.CRITTERS_LOG_LEVEL = process.env.CRITTERS_LOG_LEVEL || 'error';

// Single source of truth for module aliases needed by both bundlers, so a new entry
// only has to be added here. Turbopack's resolveAlias needs relative-path strings;
// webpack's resolve.alias needs absolute paths (resolved from these below).
const SHARED_RESOLVE_ALIASES = {
	'@tanstack/react-query': './node_modules/@tanstack/react-query',
	'use-query-params': './node_modules/use-query-params',
	'react-select': './node_modules/react-select',
	'react-select/creatable': './node_modules/react-select/creatable',
	'react-select/async': './node_modules/react-select/async',
	'react-hook-form': './node_modules/react-hook-form',
	'react-datepicker': './node_modules/react-datepicker',
};

/** @type {import("next").NextConfig} */
module.exports = {
	transpilePackages: ['ky-universal', '@viaa/avo2-components', '@meemoo/react-components'],
	i18n: {
		locales: ['nl', 'en'],
		defaultLocale: 'nl',
		localeDetection: false,
	},
	// https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
	// Disabling react strict mode, otherwise the zendesk widget is rendered twice
	reactStrictMode: false,
	// SCSS modules use root-relative imports like `@use 'src/styles/abstracts'`.
	// sass-loader v16 (Next 16, modern Sass API) needs the project root added explicitly as a load path.
	sassOptions: {
		loadPaths: [path.resolve(__dirname)],
		includePaths: [path.resolve(__dirname)],
	},
	experimental: {
		/**
		 * Ignore warnings about big page data, since we load translations like that
		 * https://meemoo.atlassian.net/browse/ARC-1932
		 */
		largePageDataBytes: 400 * 1000,

		// Attempt to improve css loading
		// https://meemoo.atlassian.net/browse/ARC-2913
		optimizeCss: true,
	},
	typescript: {
		tsconfigPath: './tsconfig.build.json',
	},
	// Fix issues with react-query on the server:
	// https://github.com/TanStack/query/issues/3595#issuecomment-1276468579
	serverExternalPackages: ['@tanstack/react-query', 'use-query-params'],
	turbopack: {
		resolveAlias: SHARED_RESOLVE_ALIASES,
	},
	webpack: (config) => {
		config.mode = 'production';

		// Required for ky-universal top level await used in admin core inside the api service
		config.experiments = { topLevelAwait: true, layers: true };

		// https://stackoverflow.com/a/68098547/373207
		config.resolve.fallback = { fs: false, path: false };

		// @meemoo/admin-core-ui ships a single pre-bundled file with its own source map.
		// Webpack treats node_modules as opaque by default, so it maps stack frames back to
		// that one bundled file and stops there. source-map-loader reads and chains the
		// package's own map so DevTools can resolve all the way to the original source.
		config.module.rules.push({
			test: /\.js$/,
			include: /node_modules[\\/]@meemoo[\\/]admin-core-ui/,
			enforce: 'pre',
			use: ['source-map-loader'],
		});

		// Ensure certain packages are always resolved to one version instead of other versions from admin-core or component libraries
		config.resolve.alias = {
			...config.resolve.alias,
			...Object.fromEntries(
				Object.entries(SHARED_RESOLVE_ALIASES).map(([name, relativePath]) => [
					name,
					path.resolve(relativePath),
				])
			),
		};

		return config;
	},
	images: {
		unoptimized: true,
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
			// villanella => de-studio
			// https://meemoo.atlassian.net/browse/ARC-3304
			{
				source: '/bezoek/villanella/:path*',
				destination: '/bezoek/de-studio/:path*',
				permanent: true,
			},
			{
				source: '/zoeken/villanella/:path*',
				destination: '/zoeken/de-studio/:path*',
				permanent: true,
			},
			{
				source: '/zoeken',
				has: [
					{
						type: 'query',
						key: 'aanbieder',
						value: 'villanella',
					},
				],
				destination: '/zoeken?aanbieder=de-studio',
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
			{
				// Redirect bad /pid/:pid/:num urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/pid/:pid/:num([0-9]+)',
				destination: '/pid/:pid',
				permanent: true,
			},
			{
				// Redirect bad /:language/iframe/media/title/:id/:num urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/:language(fr|nl|de|en)/iframe/media/:title/:nvdgoId([a-zA-Z0-9]+)/:num([0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/iframe/media/title/:id urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/:language(fr|nl|de|en)/iframe/media/:title/:nvdgoId([a-zA-Z0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/media/title/:id/:num urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/:language(fr|nl|de|en)/media/:title/:nvdgoId([a-zA-Z0-9]+)/:num([0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/media/title/:id urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/:language(fr|nl|de|en)/media/:title/:nvdgoId([a-zA-Z0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/iframe/media/title/:id/:num urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/iframe/media/:title/:nvdgoId([a-zA-Z0-9]+)/:num([0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/iframe/media/title/:id urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/iframe/media/:title/:nvdgoId([a-zA-Z0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/media/title/:id/:num urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/media/:title/:nvdgoId([a-zA-Z0-9]+)/:num([0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
			{
				// Redirect bad /:language/media/title/:id urls from the NieuwsVanDeGroteOorlog website to the correct object page
				source: '/media/:title/:nvdgoId([a-zA-Z0-9]+)',
				destination: '/media/:nvdgoId',
				permanent: true,
			},
		];
	},
};
