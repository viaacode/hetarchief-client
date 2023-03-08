import { ContentPageInfo, ContentPageService } from '@meemoo/admin-core-ui';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { startsWith } from 'lodash';

import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetContentPageByPath = (
	path: string | undefined
): UseQueryResult<ContentPageInfo | null> => {
	return useQuery([QUERY_KEYS.getContentPage, { path }], () => {
		if (!path) {
			return null;
		}

		if (!startsWith(path, '/')) {
			throw new Error(`Given path doesn't start with a slash. Received path: ${path}`);
		}

		console.log('getting page with slug');
		return ContentPageService.getContentPageByPath(path);
	});
};
