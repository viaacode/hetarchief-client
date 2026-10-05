export const omitEmptyFilters = (
	filters: Record<string, string | (string | null)[] | null | undefined>
): Record<string, string | string[]> =>
	Object.fromEntries(
		Object.entries(filters).flatMap(([key, value]) => {
			const cleaned = Array.isArray(value) ? value.filter((v): v is string => !!v) : value;
			return cleaned?.length ? [[key, cleaned]] : [];
		})
	);
