export function getSlugFromQueryParams(
	queryParams: Record<string, string | string[] | undefined>
): string {
	return [queryParams.slug, queryParams.deeperslug]
		.flat()
		.filter((part) => !!part)
		.join('/');
}
