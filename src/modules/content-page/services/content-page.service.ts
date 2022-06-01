import { ApiService } from '@shared/services/api-service';

import { CONTENT_PAGE_SERVICE_BASE_URL } from './content-page.service.const';
import { ContentPageExistsInfo } from './content-page.service.types';

export class ContentPageService {
	public static async getBySlug(
		slug?: string | null,
		ignoreAuthError = false
	): Promise<ContentPageExistsInfo | null> {
		console.log('slug: ' + slug);
		if (!slug) {
			return null;
		}
		return await ApiService.getApi(ignoreAuthError)
			.get(`${CONTENT_PAGE_SERVICE_BASE_URL}/path-exist?path=${slug}`)
			.json();
	}
}
