import { ContentPageInfo, ContentPageService, LanguageCode } from '@meemoo/admin-core-ui';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { startsWith } from 'lodash-es';

import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetContentPageByLanguageAndPath = (
	language: LanguageCode,
	path: string | undefined
): UseQueryResult<ContentPageInfo | null> => {
	return useQuery([QUERY_KEYS.getContentPage, { path }], () => {
		if (!path) {
			return null;
		}

		if (!startsWith(path, '/')) {
			throw new Error(`Given path doesn't start with a slash. Received path: ${path}`);
		}

		return ContentPageService.getContentPageByLanguageAndPath(language, path);
	});
};
