import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetMediaTicketInfo(
	id: string | null,
	onComplete: () => void
): UseQueryResult<string> {
	return useQuery([QUERY_KEYS.getMediaInfo, { id }], () => MediaService.getPlayableUrl(id), {
		keepPreviousData: true,
		onSuccess: onComplete,
	});
}
