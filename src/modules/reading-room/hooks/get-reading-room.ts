import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { VistorSpaceService } from '@reading-room/services';
import { VisitorSpaceInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetReadingRoom(
	slug: string | null,
	enabled = true
): UseQueryResult<VisitorSpaceInfo> {
	return useQuery(
		[QUERY_KEYS.getMediaInfo, { slug }],
		() => VistorSpaceService.getBySlug(slug as string),
		{
			enabled,
		}
	);
}
