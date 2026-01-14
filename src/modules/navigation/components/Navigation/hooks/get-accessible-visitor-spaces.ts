import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { VisitorSpaceService } from '@visitor-space/services';
import type { VisitorSpaceInfo } from '@visitor-space/types';

export function useGetAccessibleVisitorSpaces({
	canViewAllSpaces,
}: {
	canViewAllSpaces: boolean;
}): UseQueryResult<VisitorSpaceInfo[]> {
	return useQuery({
		queryKey: [QUERY_KEYS.getAccessibleVisitorSpaces, canViewAllSpaces],
		queryFn: () => VisitorSpaceService.getAllAccessible(canViewAllSpaces),
		placeholderData: keepPreviousData,
	});
}
