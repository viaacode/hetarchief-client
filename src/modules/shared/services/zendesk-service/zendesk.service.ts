import type { Requests } from 'node-zendesk';

import { ApiService } from '../api-service';

import {
	ZENDESK_SERVICE_BASE_URL,
	ZENDESK_SERVICE_IE_OBJECT_SUPPORT_URL,
	ZENDESK_SERVICE_SUPPORT_URL,
} from './zendesk.const';
import type { IeObjectSupportPayload } from './zendesk.types';

export class ZendeskService {
	public static async createTicket(request: Requests.CreateModel): Promise<Requests.ResponseModel> {
		return ApiService.getApi()
			.post(`${ZENDESK_SERVICE_BASE_URL}/${ZENDESK_SERVICE_SUPPORT_URL}`, {
				json: request,
			})
			.json();
	}

	public static async createIeObjectSupportTicket(
		request: IeObjectSupportPayload
	): Promise<Requests.ResponseModel> {
		return ApiService.getApi()
			.post(`${ZENDESK_SERVICE_BASE_URL}/${ZENDESK_SERVICE_IE_OBJECT_SUPPORT_URL}`, {
				json: request,
			})
			.json();
	}
}
