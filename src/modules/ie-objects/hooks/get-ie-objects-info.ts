import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
import { QUERY_KEYS } from '@shared/const/query-keys';

import type { IeObject } from './../ie-objects.types';
import { IeObjectsService } from './../services';

/**
 * Get an IE object by its schemaIdentifier
 * @param schemaIdentifier The ie object schemaIdentifier, eg: 086348mc8s
 */
export async function getIeObjectInfoBySchemaIdentifier(
	schemaIdentifier: string
): Promise<IeObject | null> {
	return IeObjectsService.getBySchemaIdentifier(schemaIdentifier);
}

export const useGetIeObjectInfo = (
	schemaIdentifier: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, schemaIdentifier],
		async () => {
			let newSchemaIdentifier: string;
			if (schemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
				// This is an old schema identifier (v2), we need to convert it to a new one (v3)
				const v3IdentifierResponse =
					await IeObjectsService.schemaIdentifierLookup(schemaIdentifier);
				newSchemaIdentifier = v3IdentifierResponse.id;
			} else {
				// This is already a new schema identifier (v3)
				newSchemaIdentifier = schemaIdentifier;
			}
			return getIeObjectInfoBySchemaIdentifier(newSchemaIdentifier);
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
		queryFn: () => getIeObjectInfoBySchemaIdentifier(schemaIdentifier),
	});
}
