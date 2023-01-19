import { ContentPageInfo } from '@meemoo/admin-core-ui';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { HTTPError } from 'ky';

import { ContentPageService } from '../services/content-page.service';

export const useGetContentPageByPath = (
	path: string | undefined,
	options?: UseQueryOptions<
		ContentPageInfo | null,
		HTTPError,
		ContentPageInfo | null,
		'GET_CONTENT_PAGE_BY_PATH'[]
	>
) => {
	return useQuery(
		['GET_CONTENT_PAGE_BY_PATH'],
		() => {
			if (!path) {
				return null;
			}
			return ContentPageService.getBySlug(path, true);
		},
		options
	);
};
