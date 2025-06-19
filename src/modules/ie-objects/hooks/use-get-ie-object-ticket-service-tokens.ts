import { type UseQueryResult, useQuery } from '@tanstack/react-query';

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
			const tokens = await IeObjectsService.getTicketServiceTokens(filePaths);
			return Object.fromEntries(
				filePaths.map((filePath, index) => [filePath, tokens[index] || null])
			);
		},
		{
			keepPreviousData: true,
			enabled: true,
			...options,
		}
	);
};
