import type { IeObjectSimilar } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetIeObjectsAlsoInteresting = (
	schemaIdentifier: string | undefined,
	maintainerId = '',
	enabled: boolean = true
): UseQueryResult<IeObjectSimilar | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsSimilar, schemaIdentifier, maintainerId],
		queryFn: () => {
			if (!schemaIdentifier) {
				return null;
			}
			return IeObjectsService.getSimilar(schemaIdentifier, maintainerId);
		},
		enabled,
	});
};

export async function makeServerSideRequestGetIeObjectsSimilar(
	queryClient: QueryClient,
	id: string,
	maintainerId = ''
) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsSimilar, id, maintainerId],
		queryFn: () => IeObjectsService.getSimilar(id, maintainerId),
	});
}
