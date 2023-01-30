import { ContentPageService } from '@meemoo/admin-core-ui';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { ContentPageExistsInfo } from '../services/content-page.service.types';

export function useGetContentPage(
	slug?: string | null,
	ignoreAuthError = false,
	options?: Partial<
		Omit<
			UseQueryOptions<
				ContentPageExistsInfo | null,
				unknown,
				ContentPageExistsInfo | null,
				[QUERY_KEYS, { slug?: string | null }]
			>,
			'queryKey' | 'queryFn'
		>
	>
): UseQueryResult<ContentPageExistsInfo | null> {
	return useQuery(
		[QUERY_KEYS.getContentPage, { slug }],
		() => {
			return ContentPageService.getContentPageByPath(('/' + slug) as string, ignoreAuthError);
		},
		options
	);
}
