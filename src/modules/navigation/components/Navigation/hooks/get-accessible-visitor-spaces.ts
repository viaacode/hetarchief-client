import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { VisitorSpaceService } from '@visitor-space/services';
import { VisitorSpaceInfo } from '@visitor-space/types';

export function useGetAccessibleVisitorSpaces(): UseQueryResult<VisitorSpaceInfo[]> {
	return useQuery(
		QUERY_KEYS.getAccessibleVisitorSpaces,
		() => VisitorSpaceService.getAllAccessible(),
		{
			keepPreviousData: true,
		}
	);
}
