export const VALID_SITEMAP_PRIORITIES = [
	{
		priority: 0.7,
		path: '/',
	},
	{
		priority: 0.4,
		path: '/over-de-bezoeker-tool',
	},
	{
		priority: 0.3,
		path: '/freq asked questions',
	},
	{
		priority: 0.8,
		path: '/zoeken',
	},
	{
		priority: 0,
		path: '/account',
	},
	{
		priority: 0,
		path: '/admin',
	},
	{
		priority: 0,
		path: '/uitloggen',
	},
];

export const INVALID_SITEMAP_PRIORITIES = [
	{
		priority: 0.7,
		path: '/',
	},
	{
		priority: 0.3,
		path: '/freq asked questions',
	},
	{
		priority: 0,
		path: '/account',
	},
	{
		priority: 0,
		path: '/admin',
	},
	{
		priority: 0,
		path: '/uitloggen',
	},
];

export const VALID_SITEMAP_PRIORITIES_STRING =
	'0.7 /\n0.4 /over-de-bezoeker-tool\n0.3 /freq asked questions\n0.8 /zoeken\n0 /account\n0 /admin\n0 /uitloggen';

export const VALID_SITEMAP_PRIORITIES_STRING_FUZZY =
	' 0.7 /\n  0.4\t /over-de-bezoeker-tool\n   \n0.3   /freq asked questions\n0.8 /zoeken\n\r0 /account\r0 /admin\n 0 /uitloggen   ';

export const INVALID_SITEMAP_PRIORITIES_STRING =
	' 0.7 /\n  0.4\t \n   \n0.3   /freq asked questions\n0. /zoeken\n\r0 /account\r0 /admin\n 0 /uitloggen   ';
