import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';

import { IeObjectsService } from '../services';

import { IeObjectSimilar } from '@ie-objects/types';

export const useGetIeObjectsSimilar = (
	id: string,
	enabled = true
): UseQueryResult<IeObjectSimilar> =>
	useQuery([QUERY_KEYS.getIeObjectsSimilar, { id }], () => IeObjectsService.getSimilar(id), {
		enabled,
	});
