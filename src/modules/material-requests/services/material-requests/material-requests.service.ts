import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { ApiResponseWrapper } from '@shared/types';

import { MATERIAL_REQUESTS_SERVICE_BASE_URL } from './material-requests.service.const';
import { GetMaterialRequestsProps } from './material-requests.service.types';

import { MaterialRequest, MaterialRequestDetail } from 'modules/material-requests/types';

export class MaterialRequestsService {
	public static async getAll({
		search,
		type,
		maintainerIds,
		isPending,
		page,
		size,
		orderProp,
		orderDirection,
		isPersonal = false,
	}: GetMaterialRequestsProps): Promise<ApiResponseWrapper<MaterialRequest>> {
		const result = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: isPersonal
						? `${MATERIAL_REQUESTS_SERVICE_BASE_URL}/personal`
						: MATERIAL_REQUESTS_SERVICE_BASE_URL,
					query: {
						...(search?.trim() ? { query: `%${search}%` } : {}),
						...(type && { type }),
						...(maintainerIds && { maintainerIds }),
						...(isPending && { isPending }),
						...(page && { page }),
						...(size && { size }),
						...(orderProp && { orderProp }),
						...(orderDirection && { orderDirection }),
					},
				})
			)
			.json();

		return result as ApiResponseWrapper<MaterialRequest>;
	}

	public static async getById(id: string | null): Promise<MaterialRequestDetail | null> {
		if (!id) {
			return null;
		}
		return await ApiService.getApi().get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`).json();
	}
}
