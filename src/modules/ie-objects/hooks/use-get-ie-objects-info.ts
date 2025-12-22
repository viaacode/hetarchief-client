import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IeObject } from './../ie-objects.types';
import { IeObjectsService } from './../services';

export const useGetIeObjectInfo = (
	schemaIdentifier: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery<IeObject | null>(
		[QUERY_KEYS.getIeObjectsInfo, schemaIdentifier],
		async (): Promise<IeObject | null> => {
			let newSchemaIdentifier: string;
			if (schemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
				// This is an old schema identifier (v2), we need to convert it to a new one (v3)
				const v3IdentifierResponse = await IeObjectsService.lookupV2Id(schemaIdentifier);
				newSchemaIdentifier = v3IdentifierResponse.schemaIdentifierV3;
			} else {
				// This is already a new schema identifier (v3)
				newSchemaIdentifier = schemaIdentifier;
			}
			const ieObjects = await IeObjectsService.getBySchemaIdentifiers([newSchemaIdentifier]);

			if (ieObjects[0]) {
				return ieObjects[0];
			}
			throw new Error(`404: IeObject not found: ${newSchemaIdentifier}`);
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
	schemaIdentifier: string
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, schemaIdentifier],
		queryFn: async () => {
			const ieObjects = await IeObjectsService.getBySchemaIdentifiers([schemaIdentifier]);
			return ieObjects[0];
		},
	});
}
