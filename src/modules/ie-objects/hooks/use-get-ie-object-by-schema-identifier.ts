import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
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
 * Get ieObject by schemaIdentifier. eg: qs6d5p9579
 * @param schemaIdentifier the schemaIdentifier of the ieObject. aka PID. eg: qs6d5p9579
 * @param resolveThumbnailUrl should the thumbnail urls be resolved with a token, so you can view them? (slower)
 * @param options
 */
export const useGetIeObjectBySchemaIdentifier = (
	schemaIdentifier: string,
	resolveThumbnailUrl: boolean,
	options: {
		enabled?: boolean;
		placeholderData?: typeof keepPreviousData;
	} = {}
): UseQueryResult<IeObject | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, schemaIdentifier],
		queryFn: async (): Promise<IeObject | null> => {
			let newSchemaIdentifier: string;
			if (schemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
				// This is an old schema identifier (v2), we need to convert it to a new one (v3)
				const v3IdentifierResponse = await IeObjectsService.lookupV2Id(schemaIdentifier);
				newSchemaIdentifier = v3IdentifierResponse.schemaIdentifierV3;
			} else {
				newSchemaIdentifier = schemaIdentifier;
			}
			const ieObjects = await IeObjectsService.getBySchemaIdentifiers(
				[newSchemaIdentifier],
				resolveThumbnailUrl
			);
			if (ieObjects[0]) {
				return ieObjects[0];
			}
			throw new Error(`404: IeObject not found: ${newSchemaIdentifier}`);
		},
		enabled: true,
		...options,
	});
};

export function makeServerSideRequestGetIeObjectInfo(
	queryClient: QueryClient,
	schemaIdentifier: string,
	resolveThumbnailUrl: boolean
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, schemaIdentifier],
		queryFn: async () => {
			const ieObjects = await IeObjectsService.getBySchemaIdentifiers(
				[schemaIdentifier],
				resolveThumbnailUrl
			);
			if (!ieObjects[0]) {
				// Returning undefined from a queryFn is an error in react-query v5,
				// and would end up in the dehydrated state as a broken query
				throw new Error(`404: IeObject not found: ${schemaIdentifier}`);
			}
			return ieObjects[0];
		},
	});
}

/**
 * Store an ieObject that was already fetched during server side rendering in the query cache,
 * so the client can render it immediately instead of waiting for the request to resolve in the browser.
 * @param queryClient the query client that will be dehydrated and sent to the browser
 * @param schemaIdentifier the identifier as it appears in the url, since that is what the client keys its query on
 * @param ieObject the already fetched ieObject
 */
export function setServerSideIeObjectInfo(
	queryClient: QueryClient,
	schemaIdentifier: string,
	ieObject: IeObject
): void {
	queryClient.setQueryData([QUERY_KEYS.getIeObjectsInfo, schemaIdentifier], ieObject);
}
