import { OrderDirection } from '@meemoo/react-components';
import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { type VisitAccessStatus, type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import type {
	GetAllActiveVisitsProps,
	GetVisitRequestsProps,
} from '@visit-requests/services/visit-request/visit-request.service.types';
import type { PatchVisit } from '@visit-requests/types';
import type { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

import {
	VISITS_SERVICE_ACCESS_STATUS_URL,
	VISITS_SERVICE_ACTIVE_SPACE_URL,
	VISITS_SERVICE_BASE_URL,
	VISITS_SERVICE_PENDING_COUNT_URL,
	VISITS_SERVICE_SPACE_URL,
} from './visit-request.service.const';

export namespace VisitRequestService {
	export async function getAll({
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
		ignoreAuthError = false,
	}: GetVisitRequestsProps): Promise<IPagination<VisitRequest>> {
		const url = stringifyUrl({
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
		});
		const parsed = await ApiService.getApi(ignoreAuthError).get(url).json();
		return parsed as IPagination<VisitRequest>;
	}

	export async function getById(id: string): Promise<VisitRequest> {
		return await ApiService.getApi().get(`${VISITS_SERVICE_BASE_URL}/${id}`).json();
	}

	export async function patchById(id: string, visit: PatchVisit): Promise<VisitRequest> {
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

	export async function create(visitRequest: CreateVisitRequest): Promise<VisitRequest> {
		return await ApiService.getApi()
			.post(VISITS_SERVICE_BASE_URL, { body: JSON.stringify(visitRequest) })
			.json();
	}

	export async function getActiveVisitForUserAndSpace(
		visitorSpaceSlug: string
	): Promise<VisitRequest | null> {
		if (!visitorSpaceSlug) {
			return null;
		}
		return await ApiService.getApi()
			.get(
				`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_ACTIVE_SPACE_URL}/${visitorSpaceSlug}`
			)
			.json();
	}

	export async function getPendingVisitCountForUserBySlug(
		slug: string
	): Promise<VisitRequest | null> {
		if (!slug) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${VISITS_SERVICE_BASE_URL}/${VISITS_SERVICE_PENDING_COUNT_URL}/${slug}`)
			.json();
	}

	export async function getAccessStatusBySpaceSlug(
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

	export async function getAllActiveVisits({
		requesterId,
		orderProp = 'endAt',
		orderDirection = OrderDirection.asc,
		page = 0,
		size = 20,
	}: GetAllActiveVisitsProps): Promise<IPagination<VisitRequest>> {
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
		return parsed as IPagination<VisitRequest>;
	}
}
