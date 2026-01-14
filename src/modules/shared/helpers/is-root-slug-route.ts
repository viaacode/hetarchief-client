export function isRootSlugRoute(route: string): boolean {
	return (
		route === '/[lang]/[slug]' ||
		route === '/[slug]' ||
		route === '/[lang]/[...fallback]' ||
		route === '/[...fallback]'
	);
}
