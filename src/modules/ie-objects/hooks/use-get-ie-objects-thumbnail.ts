import { QUERY_KEYS } from '@shared/const/query-keys';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { IeObjectsService } from './../services';

export const useGetIeObjectThumbnail = (
	schemaIdentifier: string,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<string | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectsThumbnail, schemaIdentifier],
		queryFn: async (): Promise<string | null> => {
			if (schemaIdentifier.startsWith('_next')) {
				return null;
			}
			return await IeObjectsService.getThumbnailBySchemaIdentifier(schemaIdentifier);
		},
		enabled: true,
		...options,
	});
};

export function makeServerSideRequestGetIeObjectThumbnail(
	queryClient: QueryClient,
	schemaIdentifier: string
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsThumbnail, schemaIdentifier],
		queryFn: async () => {
			if (schemaIdentifier.startsWith('_next')) {
				return null;
			}
			return await IeObjectsService.getThumbnailBySchemaIdentifier(schemaIdentifier);
		},
	});
}
