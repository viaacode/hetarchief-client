import { stringifyUrl } from 'query-string';

import { VisitorSpaceInfo } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';
import { ApiResponseWrapper } from '@shared/types/api';

import { VISITOR_SPACE_SERVICE_BASE_URL } from './visitor-space.service.const';
import { AccessType, UpdateReadingRoomSettings } from './visitor-space.service.types';

export class VistorSpaceService {
	public static async getAll(
		searchInput = '',
		page = 0,
		size = 20
	): Promise<ApiResponseWrapper<VisitorSpaceInfo>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITOR_SPACE_SERVICE_BASE_URL,
					query: {
						query: searchInput ? `%${searchInput}%` : undefined,
						page,
						size,
					},
				})
			)
			.json();
		return parsed as ApiResponseWrapper<VisitorSpaceInfo>;
	}

	public static async getAllAccessible(page = 0, size = 20): Promise<VisitorSpaceInfo[]> {
		const parsed = (await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITOR_SPACE_SERVICE_BASE_URL,
					query: {
						accessType: AccessType.ACTIVE,
						page,
						size,
					},
				})
			)
			.json()) as ApiResponseWrapper<VisitorSpaceInfo>;
		return parsed.items;
	}

	public static async getBySlug(slug: string | null): Promise<VisitorSpaceInfo | null> {
		if (!slug) {
			return null;
		}
		return await ApiService.getApi().get(`${VISITOR_SPACE_SERVICE_BASE_URL}/${slug}`).json();
	}

	public static async update(
		roomId: string,
		values: Partial<UpdateReadingRoomSettings>
	): Promise<VisitorSpaceInfo> {
		const formData = new FormData();

		// Set form data
		formData.append('color', values.color ?? '');
		formData.append('image', values.image ?? '');
		values.file && formData.append('file', values.file);
		values.description && formData.append('description', values.description);
		values.serviceDescription &&
			formData.append('serviceDescription', values.serviceDescription);

		const headers = {
			'Content-Type': undefined, // Overwrite application/json
		};

		return await ApiService.getApi()
			.patch(`${VISITOR_SPACE_SERVICE_BASE_URL}/${roomId}`, { body: formData, headers })
			.json();
	}
}
