import { stringifyUrl } from 'query-string';

import { AccessType } from '@reading-room/services/reading-room/reading-room.service.types';
import { ReadingRoomInfo } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';
import { ApiResponseWrapper } from '@shared/types/api';

import { READING_ROOM_SERVICE_BASE_URL } from './reading-room.service.const';

export class ReadingRoomService {
	public static async getAll(
		searchInput = '',
		page = 0,
		size = 20
	): Promise<ApiResponseWrapper<ReadingRoomInfo>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: READING_ROOM_SERVICE_BASE_URL,
					query: {
						query: searchInput ? `%${searchInput}%` : undefined,
						page,
						size,
					},
				})
			)
			.json();
		return parsed as ApiResponseWrapper<ReadingRoomInfo>;
	}

	public static async getAllAccessible(page = 0, size = 20): Promise<ReadingRoomInfo[]> {
		const parsed = (await ApiService.getApi()
			.get(
				stringifyUrl({
					url: READING_ROOM_SERVICE_BASE_URL,
					query: {
						accessType: AccessType.ACTIVE,
						page,
						size,
					},
				})
			)
			.json()) as ApiResponseWrapper<ReadingRoomInfo>;
		return parsed.items;
	}

	public static async getById(roomId: string): Promise<unknown> {
		return await ApiService.getApi().get(roomId).json();
	}
}
