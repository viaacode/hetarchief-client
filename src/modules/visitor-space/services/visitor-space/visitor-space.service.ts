import type { OrderDirection } from '@meemoo/react-components';
import type { IPagination } from '@studiohyperdrive/pagination';
import { QueryClient } from '@tanstack/react-query';
import { sortBy } from 'lodash-es';
import { stringifyUrl } from 'query-string';

import { QUERY_KEYS } from '@shared/const';
import { ApiService } from '@shared/services/api-service';

import { type VisitorSpaceInfo, type VisitorSpaceOrderProps, VisitorSpaceStatus } from '../../types';

import { VISITOR_SPACE_SERVICE_BASE_URL } from './visitor-space.service.const';
import {
	AccessType,
	type CreateVisitorSpaceSettings,
	type UpdateVisitorSpaceSettings,
} from './visitor-space.service.types';

export namespace VisitorSpaceService {
	const queryClient = new QueryClient();

	export async function getAll(
		searchInput = '',
		status: VisitorSpaceStatus[] | undefined = undefined,
		page = 0,
		size = 20,
		orderProp?: VisitorSpaceOrderProps,
		orderDirection?: OrderDirection
	): Promise<IPagination<VisitorSpaceInfo>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITOR_SPACE_SERVICE_BASE_URL,
					query: {
						query: searchInput ? `%${searchInput}%` : undefined,
						...(status ? { status } : {}),
						page,
						size,
						orderProp,
						orderDirection,
						status,
					},
				})
			)
			.json();
		return parsed as IPagination<VisitorSpaceInfo>;
	}

	export async function getAllAccessible(
		canViewAllSpaces: boolean,
		page = 0,
		size = 20
	): Promise<VisitorSpaceInfo[]> {
		const parsed = (await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITOR_SPACE_SERVICE_BASE_URL,
					query: {
						accessType: canViewAllSpaces ? undefined : AccessType.ACTIVE,
						status: canViewAllSpaces
							? [
									VisitorSpaceStatus.Requested,
									VisitorSpaceStatus.Active,
									VisitorSpaceStatus.Inactive,
							  ]
							: undefined,
						page,
						size,
					},
				})
			)
			.json()) as IPagination<VisitorSpaceInfo>;
		return sortBy(parsed.items, (space) => space.name?.toLowerCase());
	}

	export async function getBySlug(
		slug: string | null,
		ignoreAuthError: boolean
	): Promise<VisitorSpaceInfo | null> {
		if (!slug) {
			return null;
		}
		return await ApiService.getApi(ignoreAuthError)
			.get(`${VISITOR_SPACE_SERVICE_BASE_URL}/${slug}`)
			.json();
	}

	export async function create(
		values: Partial<CreateVisitorSpaceSettings>
	): Promise<VisitorSpaceInfo> {
		const formData = new FormData();

		// Set form data
		values.orId && formData.append('orId', values.orId);
		values.color && formData.append('color', values.color);
		values.image && formData.append('image', values.image);
		values.file && formData.append('file', values.file);
		values.descriptionNl && formData.append('descriptionNl', values.descriptionNl);
		values.descriptionEn && formData.append('descriptionEn', values.descriptionEn);
		values.serviceDescriptionNl &&
			formData.append('serviceDescriptionNl', values.serviceDescriptionNl);
		values.serviceDescriptionEn &&
			formData.append('serviceDescriptionEn', values.serviceDescriptionEn);
		values.status && formData.append('status', values.status);
		values.slug && formData.append('slug', values.slug);

		const headers = {
			'Content-Type': undefined, // Overwrite application/json
		};

		const response: VisitorSpaceInfo = await ApiService.getApi()
			.post(VISITOR_SPACE_SERVICE_BASE_URL, { body: formData, headers })
			.json();
		await queryClient.invalidateQueries([QUERY_KEYS.getContentPartners]);

		return response;
	}

	export async function update(
		roomId: string,
		values: Partial<UpdateVisitorSpaceSettings>
	): Promise<VisitorSpaceInfo> {
		const formData = new FormData();

		// Set form data
		if (values.color) {
			values.color && formData.append('color', values.color);
			formData.append('image', values.image || '');
		}
		values.file && formData.append('file', values.file);
		values.descriptionNl && formData.append('descriptionNl', values.descriptionNl);
		values.descriptionEn && formData.append('descriptionEn', values.descriptionEn);
		values.serviceDescriptionNl &&
			formData.append('serviceDescriptionNl', values.serviceDescriptionNl);
		values.serviceDescriptionEn &&
			formData.append('serviceDescriptionEn', values.serviceDescriptionEn);
		values.status && formData.append('status', values.status);
		values.slug && formData.append('slug', values.slug);

		const headers = {
			'Content-Type': undefined, // Overwrite application/json
		};

		return await ApiService.getApi()
			.patch(`${VISITOR_SPACE_SERVICE_BASE_URL}/${roomId}`, { body: formData, headers })
			.json();
	}
}
