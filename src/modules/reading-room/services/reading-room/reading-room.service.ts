import { stringify } from 'query-string';

import { ApiResponseWrapper, ReadingRoomInfo } from '@reading-room/types';
import { ApiService } from '@shared/services';

import { READING_ROOM_SERVICE_BASE_URL } from './reading-room.service.const';

class ReadingRoomService extends ApiService {
	public async getAll(
		searchInput = '',
		page = 0,
		size = 20
	): Promise<ApiResponseWrapper<ReadingRoomInfo>> {
		const parsed = await this.api
			.get(
				`${READING_ROOM_SERVICE_BASE_URL}?${stringify({
					query: `%${searchInput}%`,
					page,
					size,
				})}`
			)
			.json();
		return parsed as ApiResponseWrapper<ReadingRoomInfo>;
	}

	public async getById(roomId: string): Promise<unknown> {
		return await this.api.get(roomId).json();
	}
}

export const readingRoomService = new ReadingRoomService(READING_ROOM_SERVICE_BASE_URL);
