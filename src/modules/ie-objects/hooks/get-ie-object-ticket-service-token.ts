import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetIeObjectTicketServiceToken = (
	filePath: string | null,
	options: Partial<{ enabled: boolean; keepPreviousData: boolean }> = {}
): UseQueryResult<string> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectPlayerTicketToken, filePath],
		() => {
			if (!filePath) {
				return null;
			}
			return IeObjectsService.getTicketServiceToken(filePath);
		},
		{
			keepPreviousData: true,
			enabled: true,
			...options,
		}
	);
};
