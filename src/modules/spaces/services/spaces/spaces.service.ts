import { ReadingRoomInfo } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';

import { SPACES_SERVICE_BASE_URL } from './spaces.service.const';

export class SpacesService {
	public static async getBySlug(slug: string): Promise<ReadingRoomInfo> {
		return await ApiService.getApi().get(`${SPACES_SERVICE_BASE_URL}/${slug}`).json();
	}
}
