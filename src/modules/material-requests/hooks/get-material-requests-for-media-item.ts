import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { MaterialRequestsService } from '../services';
import type { MaterialRequest } from '../types';

export const useGetMaterialRequestsForMediaItem = (
	id: string | null,
	enabled?: boolean
): UseQueryResult<MaterialRequest[]> =>
	useQuery(
		[QUERY_KEYS.getMaterialRequestsDuplicates, id],
		() => MaterialRequestsService.forMediaItem(id),
		{
			enabled,
		}
	);
