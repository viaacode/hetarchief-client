import { ContentPageInfo, ContentPageService } from '@meemoo/admin-core-ui';
import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { startsWith } from 'lodash';

import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetContentPageByPath = (
	path: string | undefined,
	options?: UseQueryOptions<
		ContentPageInfo | null,
		HTTPError,
		ContentPageInfo | null,
		QUERY_KEYS[]
	>
): UseQueryResult<IPagination<ContentPageInfo>> => {
	return useQuery(
		[QUERY_KEYS.getContentPage],
		() => {
			if (!path) {
				return null;
			}

			if (!startsWith(path, '/')) {
				throw new Error(`Given path doesn't start with a slash. Received path: ${path}`);
			}

			return ContentPageService.getContentPageByPath(path);
		},
		options
	);
};
