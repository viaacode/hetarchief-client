import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { collectionsService } from '@account/services/collections';
import { FolderMedia } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types';

export function useGetCollectionMedia(
	id: string | undefined,
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<FolderMedia>> {
	return useQuery(
		[QUERY_KEYS.getCollectionMedia, { searchInput, page, size }],
		() => {
			if (id) {
				return collectionsService.getById(id, searchInput, page, size);
			}
		},
		{
			enabled: !!id,
			retry: false, // Avoid delay when API returns 404 due to empty list
		}
	);
}
