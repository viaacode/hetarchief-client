import type { RelatedIeObjects } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

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
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsRelated, ieObjectIri, parentIeObjectIri],
		queryFn: () => getIeObjectsRelated(ieObjectIri, parentIeObjectIri),
		enabled: true,
		staleTime: 5 * 60 * 1000,
		...options,
	});
};

export async function makeServerSideRequestGetIeObjectsRelated(
	queryClient: QueryClient,
	id: string,
	maintainerId?: string,
	meemooId?: string
): Promise<void> {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsRelated, id, maintainerId, meemooId],
		queryFn: () => getIeObjectsRelated('', null),
	});
}
