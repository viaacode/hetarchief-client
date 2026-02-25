import { ApiService } from '@shared/services/api-service';
import type {
	GetNewsletterPreferencesResponse,
	SetNewsletterPreferencesBody,
} from '@shared/types/newsletter';
import { stringifyUrl } from 'query-string';

import {
	CAMPAIGN_MONITOR_SERVICE_BASE_URL,
	CAMPAIGN_MONITOR_SERVICE_PREFERENCES,
} from './campaign-monitor.consts';

export class CampaignMonitorService {
	public static async getPreferences(email: string): Promise<GetNewsletterPreferencesResponse> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${CAMPAIGN_MONITOR_SERVICE_BASE_URL}/${CAMPAIGN_MONITOR_SERVICE_PREFERENCES}`,
					query: {
						email,
					},
				})
			)
			.json();
	}

	public static async setPreferences(preferences: SetNewsletterPreferencesBody): Promise<void> {
		await ApiService.getApi()
			.post(`${CAMPAIGN_MONITOR_SERVICE_BASE_URL}/${CAMPAIGN_MONITOR_SERVICE_PREFERENCES}`, {
				body: JSON.stringify(preferences),
			})
			.json();
	}
}
