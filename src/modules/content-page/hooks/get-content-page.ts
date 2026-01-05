import { ContentPageService, type DbContentPage } from '@meemoo/admin-core-ui/client';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { Locale } from '@shared/utils/i18n';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { startsWith } from 'lodash-es';

export async function getContentPageByLanguageAndPath(
	language: Locale,
	path: string | undefined
): Promise<DbContentPage | null> {
	if (!path) {
		return null;
	}

	if (!startsWith(path, '/')) {
		throw new Error(`Given path doesn't start with a slash. Received path: ${path}`);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Locale type exists in both the client and the admin-core, but they are not identical
	return ContentPageService.getContentPageByLanguageAndPath(language as any, path);
}

/**
 * Get a content page by language and path
 * @param language
 * @param path path of the content page including a leading slash
 * @param options
 */
export const useGetContentPageByLanguageAndPath = (
	language: Locale,
	path: string | undefined,
	options: { enabled?: boolean } = {}
): UseQueryResult<DbContentPage | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getContentPage, path, language],
		queryFn: () => getContentPageByLanguageAndPath(language, path),
		enabled: true,
		...options,
	});
};

export async function makeServerSideRequestGetContentPageByLanguageAndPath(
	queryClient: QueryClient,
	path: string | undefined,
	locale: Locale
) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getContentPage, path, locale],
		queryFn: () => getContentPageByLanguageAndPath(locale, path),
	});
}
