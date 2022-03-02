import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { OrderDirection } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';
import { PatchVisit, VisitInfo } from '@visits/types';

import { VISITS_SERVICE_BASE_URL } from './visits.service.const';

class VisitsService {
	public async getAll(
		searchInput = '',
		status: string | undefined,
		page = 0,
		size = 20,
		orderProp: keyof VisitInfo = 'startAt',
		orderDirection: OrderDirection = OrderDirection.desc
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
						orderProp,
						orderDirection,
					},
				})
			)
			.json();
		return parsed as ApiResponseWrapper<VisitInfo>;
	}

	public async getById(id: string): Promise<VisitInfo> {
		return await ApiService.getApi().get(`${VISITS_SERVICE_BASE_URL}/${id}`).json();
	}

	public async putById(id: string, visit: VisitInfo): Promise<VisitInfo> {
		const { status, startAt, endAt } = visit;
		const json: PatchVisit = {
			status,
			startAt,
			endAt,
			// remark: 'TODO',
			// denial: 'TODO'
		};

		return await ApiService.getApi()
			.put(`${VISITS_SERVICE_BASE_URL}/${id}`, {
				json,
			})
			.json();
	}
}

export const visitsService = new VisitsService();
