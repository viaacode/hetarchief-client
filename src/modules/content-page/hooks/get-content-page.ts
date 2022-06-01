import { useQuery } from 'react-query';
import { UseQueryOptions, UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { ContentPageService } from '../services/content-page.service';
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
			return ContentPageService.getBySlug(('/' + slug) as string, ignoreAuthError);
		},
		options
	);
}
