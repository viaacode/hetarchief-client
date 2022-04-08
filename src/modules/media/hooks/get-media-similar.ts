import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const';

import { MediaService } from '../services';
import { MediaSimilar } from '../types';

export function useGetMediaSimilar(
	id: string,
	esIndex: string,
	enabled = true
): UseQueryResult<MediaSimilar> {
	return useQuery(
		[QUERY_KEYS.getMediaSimilar, { id }],
		() => MediaService.getSimilar(id, esIndex),
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
