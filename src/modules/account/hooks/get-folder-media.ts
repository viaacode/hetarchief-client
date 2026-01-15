import { FoldersService } from '@account/services/folders';
import type { FolderIeObject } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetFolderMedia(
	id: string | undefined,
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<IPagination<FolderIeObject> | undefined> {
	return useQuery({
		queryKey: [QUERY_KEYS.getCollectionMedia, searchInput, page, size],
		queryFn: () => {
			if (id) {
				return FoldersService.getById(id, searchInput, page, size);
			}
			return undefined;
		},
		enabled: !!id,
		retry: false, // Avoid delay when API returns 404 due to empty list
	});
}
