import type { IeObjectPreviousNextIds } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { IeObjectsService } from './../services';

export const useGetIeObjectPreviousNextIds = (
	collectionId: string | undefined,
	ieObjectIri: string | undefined,
	enabled: boolean = true
): UseQueryResult<IeObjectPreviousNextIds> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsResults, collectionId, ieObjectIri],
		queryFn: async () => {
			if (!collectionId || !ieObjectIri) {
				return { previousIeObjectId: null, nextIeObjectId: null };
			}
			return IeObjectsService.getIeObjectPreviousNextIds(collectionId, ieObjectIri);
		},
		placeholderData: keepPreviousData,
		enabled,
	});
};
