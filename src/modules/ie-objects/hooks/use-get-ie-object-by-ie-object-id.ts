import { QUERY_KEYS } from '@shared/const/query-keys';
import {
	type keepPreviousData,
	type QueryClient,
	type UseQueryResult,
	useQuery,
} from '@tanstack/react-query';
import type { IeObject } from './../ie-objects.types';
import { IeObjectsService } from './../services';

/**
 * Get ieObject by ieObjectId.
 * @param ieObjectId the iri id of the ieObject. eg: https://data-qas.hetarchief.be/id/entity/qs6d5p9579
 * @param resolveThumbnailUrl should the thumbnail urls be resolved with a token, so you can view them? (slower)
 * @param options
 */
export const useGetIeObjectByIeObjectId = (
	ieObjectId: string,
	resolveThumbnailUrl: boolean,
	options: {
		enabled?: boolean;
		placeholderData?: typeof keepPreviousData;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, ieObjectId],
		queryFn: async (): Promise<IeObject | null> => {
			const ieObjects = await IeObjectsService.getByIeObjectIds([ieObjectId], resolveThumbnailUrl);
			if (ieObjects[0]) {
				return ieObjects[0];
			}
			throw new Error(`404: IeObject not found by ie Object ids: ${ieObjectId}`);
		},
		enabled: true,
		...options,
	});
};

export function makeServerSideRequestGetIeObjectByIeObjectId(
	queryClient: QueryClient,
	ieObjectId: string,
	resolveThumbnailUrl: boolean
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, ieObjectId],
		queryFn: async () => {
			const ieObjects = await IeObjectsService.getByIeObjectIds([ieObjectId], resolveThumbnailUrl);
			return ieObjects[0];
		},
	});
}
