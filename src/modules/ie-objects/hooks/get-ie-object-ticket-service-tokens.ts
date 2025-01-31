import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetIeObjectTicketServiceTokens = (
	filePaths: string[],
	options: Partial<{ enabled: boolean; keepPreviousData: boolean }> = {}
): UseQueryResult<Record<string, string | null>> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectPlayerTicketToken, filePaths],
		async () => {
			if (!filePaths || filePaths.length === 0) {
				return {};
			}
			const responses = await Promise.all(
				filePaths.map((filePath) => IeObjectsService.getTicketServiceToken(filePath))
			);
			return Object.fromEntries(
				filePaths.map((filePath, index) => [filePath, responses[index] || null])
			);
		},
		{
			keepPreviousData: true,
			enabled: true,
			...options,
		}
	);
};
