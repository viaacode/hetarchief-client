import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { IeObjectSimilar } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const';

export const useGetIeObjectsAlsoInteresting = (
	id: string,
	maintainerId = '',
	options: { enabled?: boolean } = {}
): UseQueryResult<IeObjectSimilar> =>
	useQuery(
		[QUERY_KEYS.getIeObjectsSimilar, id, maintainerId],
		() => IeObjectsService.getSimilar(id, maintainerId),
		{
			enabled: true,
			...options,
		}
	);

export async function makeServerSideRequestGetIeObjectsSimilar(
	queryClient: QueryClient,
	id: string,
	maintainerId = ''
) {
	await queryClient.prefetchQuery([QUERY_KEYS.getIeObjectsSimilar, id, maintainerId], () =>
		IeObjectsService.getSimilar(id, maintainerId)
	);
}
