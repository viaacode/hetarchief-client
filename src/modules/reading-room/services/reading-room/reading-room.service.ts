import { stringify } from 'query-string';

import { ApiService } from '@shared/services';

import { READING_ROOM_SERVICE_BASE_URL } from './reading-room.service.const';

class ReadingRoomService extends ApiService {
	public async getAll(query?: string): Promise<unknown> {
		const searchParams = query ? stringify({ query }) : {};
		return await this.api.get('', { searchParams }).json();
	}

	public async getById(roomId: string): Promise<unknown> {
		return await this.api.get(roomId).json();
	}
}

export const readingRoomService = new ReadingRoomService(READING_ROOM_SERVICE_BASE_URL);
