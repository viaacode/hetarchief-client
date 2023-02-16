import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { IeObjectsService } from 'modules/ie-objects/services';

export function useGetIeObjectsTicketInfo(
	id: string | null,
	onComplete: () => void
): UseQueryResult<string> {
	return useQuery(
		[QUERY_KEYS.getIeObjectsInfo, { id }],
		() => IeObjectsService.getPlayableUrl(id),
		{
			keepPreviousData: true,
			onSuccess: onComplete,
		}
	);
}
