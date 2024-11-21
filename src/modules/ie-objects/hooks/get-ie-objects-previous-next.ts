import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type IeObjectPreviousNextIds } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { QUERY_KEYS } from '@shared/const/query-keys';

import { IeObjectsService } from './../services';

export const useGetIeObjectPreviousNextIds = (
	collectionId: string | undefined,
	ieObjectId: string | undefined,
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<IeObjectPreviousNextIds> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsResults, collectionId, ieObjectId, options],
		async () => {
			if (!collectionId || !ieObjectId) {
				return { previousIeObjectId: null, nextIeObjectId: null };
			}
			return IeObjectsService.getIeObjectPreviousNextIds(collectionId, ieObjectId);
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};
