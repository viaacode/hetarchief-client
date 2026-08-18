import { IeObjectsService } from '@ie-objects/services/ie-objects/ie-objects.service';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

/**
 * @param startTime optional start of the snippet to play, in seconds
 * @param endTime optional end of the snippet to play, in seconds
 *
 * The times are part of the query key: the url is cached for 30 minutes, so keying on the ids
 * alone would hand a caller that wants a snippet the uncut url of an earlier request.
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
export const useGetIeObjectsTicketUrl = (
	fileId: string | undefined | null,
	schemaIdentifier: string | undefined | null,
	enabled: boolean = true,
	startTime?: number,
	endTime?: number
): UseQueryResult<string | null> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getIeObjectPlayerTicket, fileId, schemaIdentifier, startTime, endTime],
		queryFn: () =>
			IeObjectsService.getPlayableUrl(
				fileId as string,
				schemaIdentifier as string,
				startTime,
				endTime
			),
		placeholderData: keepPreviousData,
		enabled: enabled && !!fileId && !!schemaIdentifier,
		staleTime: 30 * 60 * 1000, // 30 minutes
	});
};
