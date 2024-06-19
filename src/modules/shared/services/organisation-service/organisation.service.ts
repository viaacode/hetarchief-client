import { ApiService } from '@shared/services/api-service';
import { type Organisation } from '@shared/services/organisation-service/organisation.types';

export class OrganisationService {
	public static async getBySlug(
		slug: string | null,
		ignoreAuthError: boolean
	): Promise<Organisation | null> {
		if (!slug) {
			return null;
		}
		return await ApiService.getApi(ignoreAuthError).get(`organisations/${slug}`).json();
	}
}
