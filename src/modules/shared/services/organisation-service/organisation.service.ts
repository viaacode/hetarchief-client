import { ApiService } from '@shared/services/api-service';
import type {
	GetOrganisationsProps,
	Organisation,
	OrganisationListItem,
	UpdateOrganisationProps,
} from '@shared/services/organisation-service/organisation.types';
import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

const ORGANISATIONS_SERVICE_BASE_URL = 'organisations';

export class OrganisationService {
	public static async getAll({
		query,
		page,
		size,
		orderProp,
		orderDirection,
	}: GetOrganisationsProps): Promise<IPagination<OrganisationListItem>> {
		const result = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${ORGANISATIONS_SERVICE_BASE_URL}/slugs`,
					query: {
						...(query?.trim() ? { query: `%${query}%` } : {}),
						...(page && { page }),
						...(size && { size }),
						...(orderProp && { orderProp: String(orderProp) }),
						...(orderDirection && { orderDirection }),
					},
				})
			)
			.json();

		return result as IPagination<OrganisationListItem>;
	}

	public static async update(
		orgIdentifier: string,
		json: UpdateOrganisationProps
	): Promise<OrganisationListItem> {
		return ApiService.getApi()
			.patch(`${ORGANISATIONS_SERVICE_BASE_URL}/${orgIdentifier}`, { json })
			.json();
	}

	public static async getBySlug(
		slug: string | null,
		ignoreAuthError: boolean
	): Promise<Organisation | null> {
		if (!slug) {
			return null;
		}
		return await ApiService.getApi(ignoreAuthError)
			.get(`${ORGANISATIONS_SERVICE_BASE_URL}/${slug}`)
			.json();
	}
}
