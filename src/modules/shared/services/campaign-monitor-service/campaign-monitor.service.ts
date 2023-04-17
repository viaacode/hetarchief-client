import { stringifyUrl } from 'query-string';

import { GetNewsletterPreferencesResponse, SetNewsletterPreferencesBody } from '@account/types';
import { EmailTemplate } from '@shared/components/ShareFolderBlade/ShareFolderBlade.consts';
import { ApiService } from '@shared/services/api-service';

import {
	CAMPAIGN_MONITOR_SERVICE_BASE_URL,
	CAMPAIGN_MONITOR_SERVICE_PREFERENCES,
	CAMPAIGN_MONITOR_SERVICE_SEND,
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

	public static async send(json: EmailTemplate): Promise<void> {
		await ApiService.getApi()
			.post(`${CAMPAIGN_MONITOR_SERVICE_SEND}/${CAMPAIGN_MONITOR_SERVICE_SEND}`, { json })
			.json();
	}
}
