import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetIeObjectsTicketInfo = (
	fileStoredAt: string | undefined | null,
	enabled = true,
	onComplete?: () => void
): UseQueryResult<string> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectPlayerTicket, fileStoredAt],
		() => IeObjectsService.getPlayableUrl(fileStoredAt as string),
		{
			enabled: enabled && !!fileStoredAt,
			keepPreviousData: true,
			onSuccess: onComplete,
			cacheTime: 30 * 60 * 1000, // 30 minutes
			staleTime: 30 * 60 * 1000, // 30 minutes
		}
	);
};
