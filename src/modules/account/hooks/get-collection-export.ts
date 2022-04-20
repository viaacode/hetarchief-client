import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { collectionsService } from '@account/services/collections';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetCollectionExport(id?: string, enabled = true): UseQueryResult<Blob | null> {
	return useQuery(
		[QUERY_KEYS.getCollectionExport, { id }],
		() => collectionsService.getExport(id),
		{
			enabled,
		}
	);
}
