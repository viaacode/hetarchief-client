import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetMediaTicketInfo(id: string, enabled: boolean): UseQueryResult<string> {
	return useQuery([QUERY_KEYS.getMediaInfo, { id }], () => MediaService.getPlayableUrl(id), {
		enabled,
	});
}
