import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
import { QUERY_KEYS } from '@shared/const/query-keys';

import type { IeObject } from './../ie-objects.types';
import { IeObjectsService } from './../services';

export async function getIeObjectInfo(id: string): Promise<IeObject | null> {
	return IeObjectsService.getById(id);
}

export const useGetIeObjectInfo = (
	id: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, id],
		async () => {
			let newId: string;
			if (id.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
				const v3IdentifierResponse = await IeObjectsService.schemaIdentifierLookup(id);
				newId = v3IdentifierResponse.schemaIdentifierV3;
			} else {
				newId = id;
			}
			return getIeObjectInfo(newId);
		},
		{
			keepPreviousData: true,
			enabled: true,
			...options,
		}
	);
};

export function makeServerSideRequestGetIeObjectInfo(
	queryClient: QueryClient,
	id: string
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, id],
		queryFn: () => getIeObjectInfo(id),
	});
}
