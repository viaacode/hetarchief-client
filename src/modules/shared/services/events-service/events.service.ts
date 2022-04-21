import { ApiService } from '../api-service';

import { EVENTS_BASE_URL } from './events.service.const';
import { LogEventType } from './events.service.types';

export class EventsService {
	public static async triggerEvent(
		type: LogEventType,
		path: string,
		data?: Record<string, unknown>
	): Promise<boolean> {
		return await ApiService.getApi()
			.post(EVENTS_BASE_URL, {
				json: { type, path, data },
			})
			.json();
	}
}
