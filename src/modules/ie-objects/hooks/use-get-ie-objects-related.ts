import type { RelatedIeObjects } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';
import {
	keepPreviousData,
	type QueryClient,
	type UseQueryResult,
	useQuery,
} from '@tanstack/react-query';

async function getIeObjectsRelated(
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
	enabled: boolean = true
): UseQueryResult<RelatedIeObjects> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsRelated, ieObjectIri, parentIeObjectIri],
		queryFn: () => getIeObjectsRelated(ieObjectIri, parentIeObjectIri),
		placeholderData: keepPreviousData,
		enabled,
		staleTime: 5 * 60 * 1000,
	});
};

export async function makeServerSideRequestGetIeObjectsRelated(
	queryClient: QueryClient,
	ieObjectIri: string | undefined,
	parentIeObjectIri: string | null
): Promise<void> {
	// The query key has to match the one in useGetIeObjectsRelated exactly,
	// otherwise the prefetched data is never picked up during hydration
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsRelated, ieObjectIri, parentIeObjectIri],
		queryFn: () => getIeObjectsRelated(ieObjectIri, parentIeObjectIri),
	});
}
