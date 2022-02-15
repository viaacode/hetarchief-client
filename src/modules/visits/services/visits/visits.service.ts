import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services';
import { ApiResponseWrapper } from '@shared/types/api';
import { VisitInfo } from '@visits/types';

import { VISITS_SERVICE_BASE_URL } from './visits.service.const';

class VisitsService extends ApiService {
	public async getAll(
		searchInput = '',
		status: string | undefined,
		page = 0,
		size = 20
	): Promise<ApiResponseWrapper<VisitInfo>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITS_SERVICE_BASE_URL,
					query: {
						query: `%${searchInput}%`,
						status,
						page,
						size,
					},
				})
			)
			.json();
		return parsed as ApiResponseWrapper<VisitInfo>;
	}

	public async getById(roomId: string): Promise<unknown> {
		return await ApiService.getApi().get(`${VISITS_SERVICE_BASE_URL}/${roomId}`).json();
	}
}

export const visitsService = new VisitsService();
