export const ROUTE_PARTS = Object.freeze({
	beheer: 'beheer',
	admin: 'admin',
	account: 'account',
	visitRequests: 'aanvragen',
	about: 'over-leeszalen',
	faq: 'faq',
	userPolicy: 'gebruiksvoorwaarden',
	cookiebeleid: 'cookiebeleid',
	userManagement: 'gebruikersbeheer',
	user: 'gebruikers',
	permissions: 'permissies',
	translations: 'vertalingen',
	cookiePolicy: 'cookiebeleid',
	notFound: '404',
	accessRequested: 'toegang-aangevraagd',
	myFolders: 'mijn-mappen',
	myHistory: 'mijn-historiek',
	visitorSpaceManagement: 'bezoekersruimtes-beheer',
	visitorSpaces: 'bezoekersruimtes',
	visitors: 'actieve-bezoekers',
	content: 'content',
	create: 'maak',
	edit: 'bewerk',
});

// Note: Also used to set 'Bezoekersruimtes' active state if url does not start with any of the following prefixes
export const ROUTE_PREFIXES = Object.freeze({
	beheer: ROUTE_PARTS.beheer,
	admin: ROUTE_PARTS.admin,
	account: ROUTE_PARTS.account,
	about: ROUTE_PARTS.about,
	faq: ROUTE_PARTS.faq,
	gebruiksvoorwaarden: ROUTE_PARTS.userPolicy,
	cookiebeleid: ROUTE_PARTS.cookiebeleid,
	notFound: ROUTE_PARTS.notFound,
});

export const ROUTES = Object.freeze({
	home: '/',
	space: '/:slug',
	termsOfService: '/' + ROUTE_PARTS.userPolicy,
	cookiePolicy: '/' + ROUTE_PARTS.cookiebeleid,
	myCollections: `/${ROUTE_PARTS.account}/${ROUTE_PARTS.myFolders}`,
	myHistory: `/${ROUTE_PARTS.account}/${ROUTE_PARTS.myHistory}`,
	visitRequested: `/:slug/${ROUTE_PARTS.accessRequested}`,
	adminEditSpace: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}/:slug`,
	beheerRequests: `/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.visitRequests}`,
});
