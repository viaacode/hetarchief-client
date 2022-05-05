import { useQuery } from 'react-query';
import { UseQueryOptions, UseQueryResult } from 'react-query/types/react/types';

import { VistorSpaceService } from '@reading-room/services';
import { VisitorSpaceInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetReadingRoom(
	slug?: string | null,
	options?: Partial<
		Omit<
			UseQueryOptions<
				VisitorSpaceInfo | null,
				unknown,
				VisitorSpaceInfo | null,
				[QUERY_KEYS, { slug?: string | null }]
			>,
			'queryKey' | 'queryFn'
		>
	>
): UseQueryResult<VisitorSpaceInfo | null> {
	return useQuery(
		[QUERY_KEYS.getMediaInfo, { slug }],
		() => VistorSpaceService.getBySlug(slug as string),
		options
	);
}
