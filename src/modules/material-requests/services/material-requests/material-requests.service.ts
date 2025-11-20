import type {
	MaterialRequest,
	MaterialRequestCreation,
	MaterialRequestDetail,
	MaterialRequestMaintainer,
	MaterialRequestSendAll,
	MaterialRequestUpdate,
} from '@material-requests/types';
import { ApiService } from '@shared/services/api-service';
import type { IPagination } from '@studiohyperdrive/pagination';
import { isNil } from 'lodash-es';
import { stringifyUrl } from 'query-string';

import { MATERIAL_REQUESTS_SERVICE_BASE_URL } from './material-requests.service.const';
import type { GetMaterialRequestsProps } from './material-requests.service.types';

export abstract class MaterialRequestsService {
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
	}: GetMaterialRequestsProps): Promise<IPagination<MaterialRequest>> {
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
						...(!isNil(isPending) && { isPending }),
						...(page && { page }),
						...(size && { size }),
						...(orderProp && { orderProp }),
						...(orderDirection && { orderDirection }),
					},
				})
			)
			.json();

		return result as IPagination<MaterialRequest>;
	}

	public static async getById(id: string | null): Promise<MaterialRequestDetail | null> {
		if (!id) {
			return null;
		}
		return ApiService.getApi().get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async getMaintainers(): Promise<MaterialRequestMaintainer[] | null> {
		return ApiService.getApi().get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/maintainers`).json();
	}

	public static async create(json: MaterialRequestCreation): Promise<void> {
		return ApiService.getApi().put(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}`, { json }).json();
	}

	public static async update(
		id: string,
		json: MaterialRequestUpdate
	): Promise<MaterialRequestDetail | null> {
		return ApiService.getApi()
			.patch(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`, { json })
			.json();
	}

	public static async delete(id: string | null): Promise<MaterialRequestDetail | null> {
		if (!id) {
			return null;
		}
		return ApiService.getApi().delete(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async sendAll(json: MaterialRequestSendAll): Promise<void> {
		return ApiService.getApi().post(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/send`, { json }).json();
	}

	public static async forMediaItem(itemId?: string | null): Promise<MaterialRequest[]> {
		if (!itemId) {
			return [];
		}

		const materialRequests = await MaterialRequestsService.getAll({
			size: 500,
			isPending: true,
			isPersonal: true,
		});

		return (materialRequests?.items || []).filter(
			(request) => request.objectSchemaIdentifier === itemId
		);
	}
}
