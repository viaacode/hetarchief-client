import { ContentPageInfo } from '@meemoo/admin-core-ui';
import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';

export class ContentPageClientService {
	public static async getBySlug(slug?: string | null): Promise<ContentPageInfo | null> {
		if (!slug) {
			return null;
		}

		const url = stringifyUrl({
			url: `admin/content-pages`,
			query: {
				path: slug,
			},
		});

		return await ApiService.getApi(true).get(url).json();
	}
}
