// Note: Also used to set 'Bezoekersruimtes' active state if url does not start with any of the following prefixes
export const ROUTE_PREFIXES = {
	beheer: 'beheer',
	admin: 'admin',
	account: 'account',
	about: 'over-leeszalen',
	faq: 'faq',
	gebruiksvoorwaarden: 'gebruiksvoorwaarden',
	notFound: '404',
};

export const ROUTES = {
	home: '/',
	termsOfService: '/gebruiksvoorwaarden',
	myCollections: '/account/mijn-mappen',
	visitRequested: '/:slug/toegang-aangevraagd',
	adminEditSpace: 'admin/leeszalenbeheer/leeszalen/:slug',
};
