import { ApiService } from '../api-service';

import { isServerSideRendering } from '@shared/utils/is-browser';
import { EVENTS_BASE_URL } from './events.service.const';
import type { LogEventType } from './events.service.types';

export class EventsService {
	public static async triggerEvent(
		type: LogEventType,
		path: string,
		data?: Record<string, unknown>
	): Promise<boolean> {
		if (isServerSideRendering()) {
			return false; // Do not trigger events on the server side
		}
		return await ApiService.getApi()
			.post(EVENTS_BASE_URL, {
				json: { type, path, data },
			})
			.json();
	}
}
