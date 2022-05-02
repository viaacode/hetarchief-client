// Note: Also used to set 'Bezoekersruimtes' active state if url does not start with any of the following prefixes
export const ROUTE_PREFIXES = {
	beheer: 'beheer',
	admin: 'admin',
	account: 'account',
	about: 'over-leeszalen',
	faq: 'faq',
	gebruiksvoorwaarden: 'gebruiksvoorwaarden',
	cookiebeleid: 'cookiebeleid',
	notFound: '404',
};

export const ROUTES = {
	home: '/',
	termsOfService: '/gebruiksvoorwaarden',
	cookiePolicy: '/cookiebeleid',
	myCollections: '/account/mijn-mappen',
	myHistory: '/account/mijn-historiek',
	visitRequested: '/:slug/toegang-aangevraagd',
	adminEditSpace: '/admin/leeszalenbeheer/leeszalen/:slug',
	beheerRequests: '/beheer/aanvragen',
};
