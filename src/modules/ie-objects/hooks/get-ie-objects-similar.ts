import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from '../services';
import { IeObjectSimilar } from '../types';

export function useGetIeObjectsSimilar(
	id: string,
	enabled = true
): UseQueryResult<IeObjectSimilar> {
	return useQuery(
		[QUERY_KEYS.getIeObjectsSimilar, { id }],
		() => IeObjectsService.getSimilar(id),
		{
			enabled,
		}
	);
}
