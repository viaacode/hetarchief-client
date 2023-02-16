import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { IeObjectsService } from 'modules/ie-objects/services';
import { IeObject } from 'modules/ie-objects/types';

export function useGetIeObjectsInfo(id: string): UseQueryResult<IeObject> {
	return useQuery([QUERY_KEYS.getIeObjectsInfo, { id }], () => IeObjectsService.getById(id), {
		keepPreviousData: false,
	});
}
