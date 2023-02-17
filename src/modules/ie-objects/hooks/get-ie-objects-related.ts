import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from '../services';
import { IeObject } from '../types';

export function useGetIeObjectsRelated(
	id: string,
	esIndex: string,
	meemooId: string,
	enabled = true
): UseQueryResult<IPagination<IeObject>> {
	return useQuery(
		[QUERY_KEYS.getIeObjectsRelated, { id }],
		() => IeObjectsService.getRelated(id, esIndex, meemooId),
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
