import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { VisitorSpaceService } from '../services';
import { VisitorSpaceInfo } from '../types';

export function useGetVisitorSpace(
	slug: string | null,
	ignoreAuthError = false,
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
		() => VisitorSpaceService.getBySlug(slug as string, ignoreAuthError),
		options
	);
}
