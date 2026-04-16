import {
	type MaterialRequest,
	type MaterialRequestAttachment,
	type MaterialRequestCreation,
	type MaterialRequestDetail,
	type MaterialRequestMaintainer,
	type MaterialRequestMessage,
	type MaterialRequestSendAll,
	MaterialRequestStatus,
	type MaterialRequestUpdate,
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
		status,
		hasDownloadUrl,
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
						...(status && { status }),
						...(hasDownloadUrl && { hasDownloadUrl }),
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

	public static async getById(id: string | null): Promise<MaterialRequest | null> {
		if (!id) {
			return null;
		}
		return ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}`,
					query: { resolveThumbnailUrl: true },
				})
			)
			.json();
	}

	public static async handleDownload(id: string): Promise<string> {
		return ApiService.getApi().get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}/download`).text();
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

	public static async cancel(id: string): Promise<MaterialRequestDetail | null> {
		return MaterialRequestsService.updateMaterialRequestStatus(id, MaterialRequestStatus.CANCELLED);
	}

	public static async setAsPending(id: string): Promise<MaterialRequestDetail | null> {
		return MaterialRequestsService.updateMaterialRequestStatus(id, MaterialRequestStatus.PENDING);
	}

	public static async approve(
		id: string,
		motivation?: string
	): Promise<MaterialRequestDetail | null> {
		return MaterialRequestsService.updateMaterialRequestStatus(
			id,
			MaterialRequestStatus.APPROVED,
			motivation
		);
	}

	public static async deny(id: string, motivation?: string): Promise<MaterialRequestDetail | null> {
		return MaterialRequestsService.updateMaterialRequestStatus(
			id,
			MaterialRequestStatus.DENIED,
			motivation
		);
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

	public static async forMediaItem(
		objectSchemaIdentifier?: string | null
	): Promise<MaterialRequest[]> {
		if (!objectSchemaIdentifier) {
			return [];
		}

		const materialRequests = await MaterialRequestsService.getAll({
			size: 500,
			isPending: true,
			isPersonal: true,
		});

		return (materialRequests?.items || []).filter(
			(request) => request.objectSchemaIdentifier === objectSchemaIdentifier
		);
	}

	private static async updateMaterialRequestStatus(
		id: string,
		status: MaterialRequestStatus,
		motivation?: string
	): Promise<MaterialRequestDetail | null> {
		return ApiService.getApi()
			.patch(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${id}/status`, {
				json: { status, motivation },
			})
			.json();
	}

	public static async getAttachments(
		materialRequestId: string,
		orderProp?: string,
		orderDirection?: string,
		page?: number,
		size?: number
	): Promise<IPagination<MaterialRequestAttachment>> {
		return ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${materialRequestId}/attachments`,
					query: {
						...(orderProp && { orderProp }),
						...(orderDirection && { orderDirection }),
						...(page && { page }),
						...(size && { size }),
					},
				})
			)
			.json();
	}

	public static getMaterialRequestMessages(
		materialRequestId: string,
		page: number,
		size: number
	): Promise<IPagination<MaterialRequestMessage>> {
		const url = stringifyUrl({
			url: `${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${materialRequestId}/messages`,
			query: {
				page,
				size,
			},
		});
		return ApiService.getApi().get(url).json();
	}

	public static sendMessage(
		materialRequestId: string,
		message: string,
		files?: File[]
	): Promise<MaterialRequestMessage> {
		if (files && files.length > 0) {
			const formData = new FormData();
			formData.append('message', message);

			files.forEach((file) => {
				formData.append('files', file);
			});

			const headers = {
				'Content-Type': undefined, // Overwrite application/json to allow multipart/form-data
			};

			return ApiService.getApi()
				.post(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${materialRequestId}/messages`, {
					body: formData,
					headers,
				})
				.json();
		}

		return ApiService.getApi()
			.post(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${materialRequestId}/messages`, {
				json: { message },
			})
			.json();
	}

	public static getUnreadMessages(materialRequestId: string): Promise<{ count: number }> {
		return ApiService.getApi()
			.get(`${MATERIAL_REQUESTS_SERVICE_BASE_URL}/${materialRequestId}/messages/count-unread`)
			.json();
	}
}
