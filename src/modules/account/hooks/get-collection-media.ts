import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { collectionsService } from '@account/services/collections';
import { CollectionMedia } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types';

export function useGetCollectionMedia(
	id: string | undefined,
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<CollectionMedia>> {
	return useQuery([QUERY_KEYS.getCollectionMedia, { searchInput, page, size }], () =>
		id ? collectionsService.getById(id, searchInput, page, size) : Promise.resolve(null)
	);
}
