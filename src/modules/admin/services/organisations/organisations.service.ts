import type { Organisation } from '@admin/views/organisations/organisations.types';
import { ApiService } from '@shared/services/api-service';
import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import { ORGANISATIONS_SERVICE_BASE_URL } from './organisations.service.const';
import type { GetOrganisationsProps, UpdateOrganisationProps } from './organisations.service.types';

export abstract class OrganisationsService {
	public static async getAll({
		query,
		page,
		size,
		orderProp,
		orderDirection,
	}: GetOrganisationsProps): Promise<IPagination<Organisation>> {
		const result = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: ORGANISATIONS_SERVICE_BASE_URL,
					query: {
						...(query?.trim() ? { query } : {}),
						...(page && { page }),
						...(size && { size }),
						...(orderProp && { orderProp: String(orderProp) }),
						...(orderDirection && { orderDirection }),
					},
				})
			)
			.json();

		return result as IPagination<Organisation>;
	}

	public static async update(
		orgIdentifier: string,
		json: UpdateOrganisationProps
	): Promise<Organisation> {
		return ApiService.getApi().patch(`organisations/${orgIdentifier}`, { json }).json();
	}
}
