import { stringifyUrl } from 'query-string';

import { ContentPartnerResponse } from '@admin/types';
import { ApiService } from '@shared/services/api-service';

import { CONTENT_PARTNERS_SERVICE_BASE_URL } from './content-partners.const';

export class ContentPartnersService {
	public static async getAll(hasSpace?: boolean): Promise<ContentPartnerResponse[]> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: CONTENT_PARTNERS_SERVICE_BASE_URL,
					query: {
						hasSpace,
					},
				})
			)
			.json();
	}
}
