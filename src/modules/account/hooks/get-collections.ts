import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { collectionsService } from '@account/services/collections';
import { Collection } from '@account/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types';

export function useGetCollections(enabled = true): UseQueryResult<ApiResponseWrapper<Collection>> {
	return useQuery([QUERY_KEYS.getCollections], () => collectionsService.getAll(), { enabled });
}
