import { ContentPageService, DbContentPage } from '@meemoo/admin-core-ui';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { startsWith } from 'lodash-es';

import { QUERY_KEYS } from '@shared/const/query-keys';

async function queryFn(path: string | undefined): Promise<DbContentPage | null> {
	if (!path) {
		return null;
	}

	if (!startsWith(path, '/')) {
		throw new Error(`Given path doesn't start with a slash. Received path: ${path}`);
	}

	const contentPage = await ContentPageService.getContentPageByPath(path);
	return contentPage;
}

export const useGetContentPageByPath = (
	path: string | undefined
): UseQueryResult<DbContentPage | null> => {
	return useQuery([QUERY_KEYS.getContentPage, { path }], () => queryFn(path));
};

export const prefetchGetContentPageByPath = async (
	path: string | undefined,
	queryClient: QueryClient
): Promise<void> => {
	return queryClient.prefetchQuery([QUERY_KEYS.getContentPage, { path }], () => queryFn(path));
};
