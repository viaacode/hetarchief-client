import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from './../services';
import { IeObject } from './../types';

export const useGetIeObjectsRelated = (
	id: string,
	maintainerId: string,
	meemooId: string,
	enabled = true
): UseQueryResult<IPagination<IeObject>> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsRelated, { id }],
		() => IeObjectsService.getRelated(id, maintainerId, meemooId),
		{
			keepPreviousData: true,
			enabled,
		}
	);
};
