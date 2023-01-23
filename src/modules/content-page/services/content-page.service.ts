import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';

import { CONTENT_PAGE_SERVICE_BASE_URL } from './content-page.service.const';
import { ContentPageExistsInfo } from './content-page.service.types';

export class ContentPageService {
	public static async getBySlug(
		slug?: string | null,
		ignoreAuthError = false
	): Promise<ContentPageExistsInfo | null> {
		if (!slug) {
			return null;
		}

		const url = stringifyUrl({
			url: `${CONTENT_PAGE_SERVICE_BASE_URL}/path-exists`,
			query: {
				path: slug,
			},
		});

		return await ApiService.getApi(ignoreAuthError).get(url).json();
	}
}
