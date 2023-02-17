import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetIeObjectsTicketInfo = (
	id: string | null,
	onComplete: () => void
): UseQueryResult<string> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, { id }],
		() => IeObjectsService.getPlayableUrl(id),
		{
			keepPreviousData: true,
			onSuccess: onComplete,
		}
	);
};
