import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { MaterialRequestsService } from '../services';
import type { MaterialRequest } from '../types';

export const useGetMaterialRequestsForMediaItem = (
	schemaIdentifier: string | null,
	enabled?: boolean
): UseQueryResult<MaterialRequest[]> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestsDuplicates, schemaIdentifier],
		queryFn: () => MaterialRequestsService.forMediaItem(schemaIdentifier),
		enabled,
	});
