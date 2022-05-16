import { stringifyUrl } from 'query-string';

import { CreateVisitRequest } from '@reading-room/services/visitor-space/visitor-space.service.types';
import { ApiService } from '@shared/services/api-service';
import { OrderDirection, Visit, VisitAccessStatus, VisitStatus } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';
import { PatchVisit, VisitTimeframe } from '@visits/types';

import {
	VISITS_SERVICE_ACCESS_STATUS_URL,
	VISITS_SERVICE_ACTIVE_SPACE_URL,
	VISITS_SERVICE_BASE_URL,
	VISITS_SERVICE_PENDING_COUNT_URL,
	VISITS_SERVICE_SPACE_URL,
} from './visits.service.const';

export class VisitsService {
	public static async getAll(
		searchInput = '',
		status: VisitStatus | undefined,
		timeframe: VisitTimeframe | VisitTimeframe[] | undefined,
		page = 0,
		size = 20,
		orderProp: keyof Visit = 'startAt',
		orderDirection: OrderDirection = OrderDirection.desc,
		personal?: boolean
	): Promise<ApiResponseWrapper<Visit>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: personal ? `${VISITS_SERVICE_BASE_URL}/personal` : VISITS_SERVICE_BASE_URL,
					query: {
						...(searchInput?.trim() ? { query: `%${searchInput}%` } : {}),
						status,
						timeframe,
						page,
						size,
						orderProp,
						orderDirection,
					},
				})
			)
			.json();
		return parsed as ApiResponseWrapper<Visit>;
	}

	public static async getById(id: string): Promise<Visit> {
		return await ApiService.getApi().get(`${VISITS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async patchById(id: string, visit: PatchVisit): Promise<Visit> {
		const { status, startAt, endAt, note } = visit;
		const json: PatchVisit = {
			status,
			startAt,
			endAt,
			note,
		};

		return await ApiService.getApi()
			.patch(`${VISITS_SERVICE_BASE_URL}/${id}`, {
				json,
			})
			.json();
	}

	public static async create(visitRequest: CreateVisitRequest): Promise<Visit> {
		return await ApiService.getApi()
			.post(VISITS_SERVICE_BASE_URL, { body: JSON.stringify(visitRequest) })
			.json();
	}

	public static async getActiveVisitForUserAndSpace(spaceId: string): Promise<Visit | null> {
		if (!spaceId) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_ACTIVE_SPACE_URL}/${spaceId}`)
			.json();
	}

	public static async getPendingVisitCountForUserBySlug(slug: string): Promise<Visit | null> {
		if (!slug) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_PENDING_COUNT_URL}/${slug}`)
			.json();
	}

	public static async getAccessStatusBySpaceSlug(
		slug: string
	): Promise<VisitAccessStatus | null> {
		if (slug.length === 0) {
			return null;
		}
		return await ApiService.getApi()
			.get(
				`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_SPACE_URL}/${slug}/${VISITS_SERVICE_ACCESS_STATUS_URL}`
			)
			.json();
	}
}
