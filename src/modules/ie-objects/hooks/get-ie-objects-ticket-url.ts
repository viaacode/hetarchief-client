import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useGetIeObjectsTicketInfo = (
	fileSchemaIdentifier: string | null,
	onComplete: () => void
): UseQueryResult<string> => {
	return useQuery(
		[QUERY_KEYS.getIeObjectPlayerTicket, { fileSchemaIdentifier }],
		() => IeObjectsService.getPlayableUrl(fileSchemaIdentifier),
		{
			keepPreviousData: true,
			onSuccess: onComplete,
		}
	);
};
