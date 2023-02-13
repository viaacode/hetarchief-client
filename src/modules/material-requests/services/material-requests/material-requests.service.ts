import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { ApiResponseWrapper } from '@shared/types';

import { MATERIAL_REQUESTS_SERVICE_BASE_URL } from './material-requests.service.const';
import { GetMaterialRequestsProps } from './material-requests.service.types';

import { MaterialRequest } from 'modules/material-requests/types';

export class MaterialRequestsService {
	public static async getAll({
		query,
		type,
		maintainerIds,
		isPending,
		page,
		size,
		orderProp,
		orderDirection,
	}: GetMaterialRequestsProps): Promise<ApiResponseWrapper<MaterialRequest>> {
		const result = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: MATERIAL_REQUESTS_SERVICE_BASE_URL,
					query: {
						...(query?.trim() ? { query: `%${query}%` } : {}),
					},
				})
			)
			.json();

		console.log({ parsed: result });

		return result as ApiResponseWrapper<MaterialRequest>;
	}
}
