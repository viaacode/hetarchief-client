import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from './../services';
import { IeObjectSimilar } from './../types';

export const useGetIeObjectsSimilar = (
	id: string,
	maintainerId = '',
	enabled = true
): UseQueryResult<IeObjectSimilar> =>
	useQuery(
		[QUERY_KEYS.getIeObjectsSimilar, id, maintainerId],
		() => IeObjectsService.getSimilar(id, maintainerId),
		{
			enabled,
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
