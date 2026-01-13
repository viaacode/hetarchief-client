export function getFallbackPath(path: string | string[] | undefined | null): string | null {
	console.log('getFallbackPath called with path:', path);
	if (!path) {
		return null;
	}
	if (Array.isArray(path)) {
		return `/${path.join('/')}`;
	}
	return path ? `/${path}` : null;
}
