import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

import type { IeObjectSimilar } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';

export const useGetIeObjectsAlsoInteresting = (
	schemaIdentifier: string | undefined,
	maintainerId = '',
	options: { enabled?: boolean } = {}
): UseQueryResult<IeObjectSimilar | null> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsSimilar, schemaIdentifier, maintainerId],
		() => {
			if (!schemaIdentifier) {
				return null;
			}
			return IeObjectsService.getSimilar(schemaIdentifier, maintainerId);
		},
		{
			enabled: true,
			...options,
		}
	);
};

export async function makeServerSideRequestGetIeObjectsSimilar(
	queryClient: QueryClient,
	id: string,
	maintainerId = ''
) {
	await queryClient.prefetchQuery([QUERY_KEYS.getIeObjectsSimilar, id, maintainerId], () =>
		IeObjectsService.getSimilar(id, maintainerId)
	);
}
