import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetIeObjectsTicketUrl = (
	fileStoredAt: string | undefined | null,
	enabled = true
): UseQueryResult<string | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectPlayerTicket, fileStoredAt],
		queryFn: () => IeObjectsService.getPlayableUrl(fileStoredAt as string),
		enabled: enabled && !!fileStoredAt,
		staleTime: 30 * 60 * 1000, // 30 minutes
	});
};
