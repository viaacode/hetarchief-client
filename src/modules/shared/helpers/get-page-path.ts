export function getPagePath(pathParts: string | string[] | undefined | null): string | null {
	if (!pathParts) {
		return null;
	}
	if (Array.isArray(pathParts)) {
		return `${pathParts.join('/')}`;
	}
	return `${pathParts}`;
}
