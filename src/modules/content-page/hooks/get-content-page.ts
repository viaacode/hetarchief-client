import { ContentPageService, DbContentPage } from '@meemoo/admin-core-ui';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { startsWith } from 'lodash-es';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { Locale } from '@shared/utils';

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
	console.log('useGetContentPageByLanguageAndPath', [QUERY_KEYS.getContentPage, path, language]);
	return useQuery(
		[QUERY_KEYS.getContentPage, path, language],
		() => getContentPageByLanguageAndPath(language, path),
		{ enabled: true, ...options }
	);
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
