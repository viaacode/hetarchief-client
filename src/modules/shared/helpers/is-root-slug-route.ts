export function isRootSlugRoute(route: string): boolean {
	return (
		route === '/[lang]/[slug]' ||
		route === '/[slug]' ||
		route === '/[lang]/[slug][...deeperslug]' ||
		route === '/[slug][...deeperslug]'
	);
}
