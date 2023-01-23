import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { foldersService } from '@account/services/folders';
import { FolderMedia } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types';

export function useGetFolderMedia(
	id: string | undefined,
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<FolderMedia>> {
	return useQuery(
		[QUERY_KEYS.getCollectionMedia, { searchInput, page, size }],
		() => {
			if (id) {
				return foldersService.getById(id, searchInput, page, size);
			}
		},
		{
			enabled: !!id,
			retry: false, // Avoid delay when API returns 404 due to empty list
		}
	);
}
