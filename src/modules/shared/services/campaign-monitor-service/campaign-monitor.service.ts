import { stringifyUrl } from 'query-string';

import type { EmailTemplate } from '@shared/components/ShareFolderBlade/ShareFolderBlade.consts';
import { ApiService } from '@shared/services/api-service';
import type {
	GetNewsletterPreferencesResponse,
	SetNewsletterPreferencesBody,
} from '@shared/types/newsletter';

import {
	CAMPAIGN_MONITOR_SERVICE_BASE_URL,
	CAMPAIGN_MONITOR_SERVICE_PREFERENCES,
	CAMPAIGN_MONITOR_SERVICE_SEND,
} from './campaign-monitor.consts';

export namespace CampaignMonitorService {
	export async function getPreferences(email: string): Promise<GetNewsletterPreferencesResponse> {
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

	export async function setPreferences(preferences: SetNewsletterPreferencesBody): Promise<void> {
		await ApiService.getApi()
			.post(`${CAMPAIGN_MONITOR_SERVICE_BASE_URL}/${CAMPAIGN_MONITOR_SERVICE_PREFERENCES}`, {
				body: JSON.stringify(preferences),
			})
			.json();
	}

	export async function send(json: EmailTemplate): Promise<void> {
		await ApiService.getApi()
			.post(`${CAMPAIGN_MONITOR_SERVICE_BASE_URL}/${CAMPAIGN_MONITOR_SERVICE_SEND}`, { json })
			.json();
	}
}
