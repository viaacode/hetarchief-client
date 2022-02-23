import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { collectionsService } from '@account/services/collections';
import { Collection } from '@account/types';
import { ApiResponseWrapper } from '@shared/types';

export function useGetCollections(): UseQueryResult<ApiResponseWrapper<Collection>> {
	return useQuery([], () => collectionsService.getAll());
}
