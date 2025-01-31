import type { IPagination } from '@studiohyperdrive/pagination';
import { isNil } from 'lodash-es';
import { stringifyUrl } from 'query-string';

import type {
	MaterialRequest,
	MaterialRequestCreation,
	MaterialRequestDetail,
	MaterialRequestMaintainer,
	MaterialRequestSendAll,
	MaterialRequestUpdate,
} from '@material-requests/types';
import { ApiService } from '@shared/services/api-service';

import { MATERIAL_REQUESTS_SERVICE_BASE_URL } from './material-requests.service.const';
import type { GetMaterialRequestsProps } from './material-requests.service.types';

// TODO convert functions to react-query hooks
export namespace MaterialRequestsService {
	export async function getAll({
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

	export async function getById(id: string | null): Promise<MaterialRequestDetail | null> {
		if (!id) {
			return null;
		}
		return ApiService.getApi().get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`).json();
	}

	export async function getMaintainers(): Promise<MaterialRequestMaintainer[] | null> {
		return ApiService.getApi().get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/maintainers`).json();
	}

	export async function create(json: MaterialRequestCreation): Promise<void> {
		return ApiService.getApi().put(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}`, { json }).json();
	}

	export async function update(
		id: string,
		json: MaterialRequestUpdate
	): Promise<MaterialRequestDetail | null> {
		return ApiService.getApi()
			.patch(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`, { json })
			.json();
	}

	export async function remove(id: string | null): Promise<MaterialRequestDetail | null> {
		if (!id) {
			return null;
		}
		return ApiService.getApi().delete(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`).json();
	}

	export async function sendAll(json: MaterialRequestSendAll): Promise<void> {
		return ApiService.getApi()
			.post(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/send`, { json })
			.json();
	}
}
