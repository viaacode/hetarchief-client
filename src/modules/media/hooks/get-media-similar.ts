import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { MediaSimilar } from '@media/types';
import { QUERY_KEYS } from '@shared/const';

export function useGetMediaSimilar(
	id: string,
	esIndex: string,
	enabled = true
): UseQueryResult<MediaSimilar> {
	return useQuery(
		[QUERY_KEYS.getMediaSimilar, { id }],
		() => MediaService.getSimilar(id, esIndex),
		{
			enabled,
		}
	);
}
