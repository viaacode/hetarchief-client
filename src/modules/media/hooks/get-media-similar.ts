import { useQuery, UseQueryResult } from '@tanstack/react-query';

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
			enabled,
		}
	);
}
