import { ContentPageInfo, ContentPageService } from '@meemoo/admin-core-ui';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { HTTPError } from 'ky';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types';

export const useGetContentPageByPath = (
	path: string | undefined,
	options?: UseQueryOptions<
		ContentPageInfo | null,
		HTTPError,
		ContentPageInfo | null,
		QUERY_KEYS[]
	>
): UseQueryResult<ApiResponseWrapper<ContentPageInfo>> => {
	return useQuery(
		[QUERY_KEYS.getContentPage],
		() => {
			if (!path) {
				return null;
			}

			return ContentPageService.getContentPageByPath(path);
		},
		options
	);
};
