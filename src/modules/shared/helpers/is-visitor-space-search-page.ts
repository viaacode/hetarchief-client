export function isVisitorSpaceSearchPage(path: string): boolean {
	return /^\/[^/]+$/g.test(path);
}
