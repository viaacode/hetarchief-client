import { stringifyUrl } from 'query-string';

import { CreateVisitRequest } from '@reading-room/services/reading-room/reading-room.service.types';
import { ApiService } from '@shared/services/api-service';
import { OrderDirection, VisitInfo, VisitStatus } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';
import { PatchVisit, VisitTimeframe } from '@visits/types';

import { VISITS_SERVICE_ACTIVE_SPACE_URL, VISITS_SERVICE_BASE_URL } from './visits.service.const';

export class VisitsService {
	public static async getAll(
		searchInput = '',
		status: VisitStatus | undefined,
		timeframe: VisitTimeframe | undefined,
		page = 0,
		size = 20,
		orderProp: keyof VisitInfo = 'startAt',
		orderDirection: OrderDirection = OrderDirection.desc,
		userProfileId?: string
	): Promise<ApiResponseWrapper<VisitInfo>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITS_SERVICE_BASE_URL,
					query: {
						query: `%${searchInput}%`,
						status,
						timeframe,
						page,
						size,
						orderProp,
						orderDirection,
						userProfileId,
					},
				})
			)
			.json();
		return parsed as ApiResponseWrapper<VisitInfo>;
	}

	public static async getById(id: string): Promise<VisitInfo> {
		return await ApiService.getApi().get(`${VISITS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async patchById(id: string, visit: VisitInfo): Promise<VisitInfo> {
		const { status, startAt, endAt } = visit;
		const json: PatchVisit = {
			status,
			startAt,
			endAt,
			// remark: 'TODO',
			// denial: 'TODO'
		};

		return await ApiService.getApi()
			.patch(`${VISITS_SERVICE_BASE_URL}/${id}`, {
				json,
			})
			.json();
	}

	public static async create(visitRequest: CreateVisitRequest): Promise<VisitInfo> {
		return await ApiService.getApi()
			.post(VISITS_SERVICE_BASE_URL, { body: JSON.stringify(visitRequest) })
			.json();
	}

	public static async getActiveVisitForUserAndSpace(spaceId: string): Promise<VisitInfo | null> {
		if (!spaceId) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_ACTIVE_SPACE_URL}/${spaceId}`)
			.json();
	}
}
