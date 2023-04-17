import { Requests } from 'node-zendesk';

import { ApiService } from '../api-service';

import { ZENDESK_SERVICE_BASE_URL, ZENDESK_SERVICE_SUPPORT_URL } from './zendesk.const';

export class ZendeskService {
	public static async createTicket(
		request: Requests.CreateModel
	): Promise<Requests.ResponseModel> {
		return ApiService.getApi()
			.post(`${ZENDESK_SERVICE_BASE_URL}/${ZENDESK_SERVICE_SUPPORT_URL}`, {
				json: request,
			})
			.json();
	}
}
