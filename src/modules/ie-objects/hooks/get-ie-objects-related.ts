import type { IPagination } from '@studiohyperdrive/pagination';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { IeObject, IeObjectSimilar } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';

export function getIeObjectsRelated(
	id: string,
	maintainerId?: string,
	meemooId?: string
): Promise<IeObjectSimilar> {
	if (!maintainerId || !meemooId || !id) {
		return Promise.resolve({
			items: [],
			page: 1,
			size: 0,
			pages: 1,
			total: 0,
		} as IPagination<IeObject>);
	}
	return IeObjectsService.getRelated(id, maintainerId, meemooId);
}

export const useGetIeObjectsRelated = (
	id: string,
	maintainerId?: string,
	meemooId?: string,
	options: { enabled?: boolean } = {}
): UseQueryResult<IPagination<IeObject>> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsRelated, id, maintainerId, meemooId],
		() => getIeObjectsRelated(id, maintainerId, meemooId),
		{
			keepPreviousData: true,
			enabled: true,
			...options,
		}
	);
};

export async function makeServerSideRequestGetIeObjectsRelated(
	queryClient: QueryClient,
	id: string,
	maintainerId?: string,
	meemooId?: string
): Promise<void> {
	await queryClient.prefetchQuery(
		[QUERY_KEYS.getIeObjectsRelated, id, maintainerId, meemooId],
		() => getIeObjectsRelated('')
	);
}
