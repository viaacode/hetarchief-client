import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { IeObjectsService } from './../services';
import { IeObject } from './../types';

export const useGetIeObjectsInfo = (id: string): UseQueryResult<IeObject> => {
	return useQuery([QUERY_KEYS.getIeObjectsInfo, { id }], () => IeObjectsService.getById(id), {
		keepPreviousData: false,
	});
};
