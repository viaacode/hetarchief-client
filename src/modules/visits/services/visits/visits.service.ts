import { OrderDirection } from '@meemoo/react-components';
import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { Visit, VisitAccessStatus, VisitStatus } from '@shared/types';
import { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';
import {
	GetAllActiveVisitsProps,
	GetVisitsProps,
} from '@visits/services/visits/visits.service.types';
import { PatchVisit } from '@visits/types';

import {
	VISITS_SERVICE_ACCESS_STATUS_URL,
	VISITS_SERVICE_ACTIVE_SPACE_URL,
	VISITS_SERVICE_BASE_URL,
	VISITS_SERVICE_PENDING_COUNT_URL,
	VISITS_SERVICE_SPACE_URL,
} from './visits.service.const';

export class VisitsService {
	public static async getAll({
		searchInput = '',
		status,
		timeframe,
		requesterId,
		visitorSpaceSlug,
		page = 0,
		size = 20,
		orderProp,
		orderDirection = OrderDirection.desc,
		personal,
	}: GetVisitsProps): Promise<IPagination<Visit>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: personal ? `${VISITS_SERVICE_BASE_URL}/personal` : VISITS_SERVICE_BASE_URL,
					query: {
						...(searchInput?.trim() ? { query: `%${searchInput}%` } : {}),
						status,
						timeframe,
						requesterId,
						visitorSpaceSlug,
						page,
						size,
						orderProp,
						orderDirection,
					},
				})
			)
			.json();
		return parsed as IPagination<Visit>;
	}

	public static async getById(id: string): Promise<Visit> {
		return await ApiService.getApi().get(`${VISITS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async patchById(id: string, visit: PatchVisit): Promise<Visit> {
		const { status, startAt, endAt, note, accessType, accessFolderIds } = visit;
		const json: PatchVisit = {
			status,
			startAt,
			endAt,
			note,
			accessType,
			accessFolderIds,
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

	public static async getActiveVisitForUserAndSpace(
		visitorSpaceSlug: string
	): Promise<Visit | null> {
		if (!visitorSpaceSlug) {
			return null;
		}
		return await ApiService.getApi()
			.get(
				`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_ACTIVE_SPACE_URL}/${visitorSpaceSlug}`
			)
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

	public static async getAllActiveVisits({
		requesterId,
		orderProp = 'endAt',
		orderDirection = OrderDirection.desc,
		page = 0,
		size = 20,
	}: GetAllActiveVisitsProps): Promise<IPagination<Visit>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${VISITS_SERVICE_BASE_URL}/personal`,
					query: {
						status: VisitStatus.APPROVED,
						timeframe: 'ACTIVE',
						requesterId,
						page,
						size,
						orderProp,
						orderDirection,
					},
				})
			)
			.json();
		return parsed as IPagination<Visit>;
	}
}
