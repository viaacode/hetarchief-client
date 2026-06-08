import { IeObjectsService } from '@ie-objects/services/ie-objects/ie-objects.service';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetIeObjectsTicketUrl = (
	fileId: string | undefined | null,
	schemaIdentifier: string | undefined | null,
	enabled: boolean = true
): UseQueryResult<string | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectPlayerTicket, fileId, schemaIdentifier],
		queryFn: () => IeObjectsService.getPlayableUrl(fileId as string, schemaIdentifier as string),
		placeholderData: keepPreviousData,
		enabled: enabled && !!fileId && !!schemaIdentifier,
		staleTime: 30 * 60 * 1000, // 30 minutes
	});
};
