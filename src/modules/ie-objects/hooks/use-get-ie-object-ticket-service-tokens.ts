import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetIeObjectTicketServiceTokens = (
	filePaths: string[],
	schemaIdentifier: string | undefined | null,
	options: Partial<{ enabled: boolean; keepPreviousData: boolean }> = {}
): UseQueryResult<Record<string, string | null>> => {
	const { enabled = true, ...queryOptions } = options;
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectPlayerTicketToken, schemaIdentifier, filePaths],
		queryFn: async () => {
			if (!filePaths || filePaths.length === 0) {
				return {};
			}
			const tokens = await IeObjectsService.getTicketServiceTokens(
				filePaths,
				schemaIdentifier as string
			);
			return Object.fromEntries(
				filePaths.map((filePath, index) => [filePath, tokens[index] || null])
			);
		},
		enabled: enabled && !!schemaIdentifier,
		placeholderData: keepPreviousData,
		...queryOptions,
	});
};
