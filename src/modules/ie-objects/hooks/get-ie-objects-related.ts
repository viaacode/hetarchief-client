import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from './../services';
import { IeObject } from './../types';

export const useGetIeObjectsRelated = (
	id: string,
	maintainerId?: string,
	meemooId?: string,
	enabled = true
): UseQueryResult<IPagination<IeObject>> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsRelated, { id }],
		() => {
			if (!maintainerId || !meemooId) {
				return Promise.resolve({
					items: [],
					page: 1,
					size: 0,
					pages: 1,
					total: 0,
				} as IPagination<IeObject>);
			}
			IeObjectsService.getRelated(id, maintainerId, meemooId);
		},
		{
			keepPreviousData: true,
			enabled,
		}
	);
};
