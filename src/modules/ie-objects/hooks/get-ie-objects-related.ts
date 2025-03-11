import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

import type { RelatedIeObjects } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';

export async function getIeObjectsRelated(
	ieObjectIri: string | undefined,
	parentIeObjectIri: string | null
): Promise<RelatedIeObjects> {
	if (!ieObjectIri) {
		return {
			parent: null,
			children: [],
		};
	}
	return IeObjectsService.getRelated(ieObjectIri, parentIeObjectIri);
}

export const useGetIeObjectsRelated = (
	ieObjectIri: string | undefined,
	parentIeObjectIri: string | null,
	options: { enabled?: boolean } = {}
): UseQueryResult<RelatedIeObjects> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsRelated, ieObjectIri, parentIeObjectIri],
		() => getIeObjectsRelated(ieObjectIri, parentIeObjectIri),
		{
			keepPreviousData: true,
			enabled: true,
			cacheTime: 5 * 60 * 1000,
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
		() => getIeObjectsRelated('', null)
	);
}
