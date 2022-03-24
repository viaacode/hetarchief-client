import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { ReadingRoomInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

import { SpacesService } from '../services/spaces';

export function useGetSpace(slug: string, enabled = true): UseQueryResult<ReadingRoomInfo> {
	return useQuery([QUERY_KEYS.getMediaInfo, { slug }], () => SpacesService.getBySlug(slug), {
		enabled,
	});
}
