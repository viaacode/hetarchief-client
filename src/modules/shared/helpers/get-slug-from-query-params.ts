export function getSlugFromQueryParams(
	queryParams: Record<string, string | string[] | undefined>
): string | undefined {
	const slug = queryParams.slug;

	if (Array.isArray(slug)) {
		return slug.join('/');
	}

	return slug;
}
