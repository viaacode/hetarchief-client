export function getFallbackPath(path: string | string[] | undefined | null): string | null {
	if (!path) {
		return null;
	}
	if (Array.isArray(path)) {
		return `${path.join('/')}`;
	}
	return `${path}`;
}
