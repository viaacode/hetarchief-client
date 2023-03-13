import { OrderDirection } from '@meemoo/react-components';
import type { IPagination } from '@studiohyperdrive/pagination';
import { QueryClient } from '@tanstack/react-query';
import { sortBy } from 'lodash-es';
import { stringifyUrl } from 'query-string';

import { QUERY_KEYS } from '@shared/const';
import { ApiService } from '@shared/services/api-service';

import { VisitorSpaceInfo, VisitorSpaceOrderProps, VisitorSpaceStatus } from '../../types';

import { VISITOR_SPACE_SERVICE_BASE_URL } from './visitor-space.service.const';
import {
	AccessType,
	CreateVisitorSpaceSettings,
	UpdateVisitorSpaceSettings,
} from './visitor-space.service.types';

export class VisitorSpaceService {
	private static queryClient = new QueryClient();

	public static async getAll(
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

	public static async getAllAccessible(page = 0, size = 20): Promise<VisitorSpaceInfo[]> {
		const parsed = (await ApiService.getApi()
			.get(
				stringifyUrl({
					url: VISITOR_SPACE_SERVICE_BASE_URL,
					query: {
						accessType: AccessType.ACTIVE,
						page,
						size,
					},
				})
			)
			.json()) as IPagination<VisitorSpaceInfo>;
		return sortBy(parsed.items, (space) => space.name?.toLowerCase());
	}

	public static async getBySlug(
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

	public static async create(
		values: Partial<CreateVisitorSpaceSettings>
	): Promise<VisitorSpaceInfo> {
		const formData = new FormData();

		// Set form data
		values.orId && formData.append('orId', values.orId);
		values.color && formData.append('color', values.color);
		values.image && formData.append('image', values.image);
		values.file && formData.append('file', values.file);
		values.description && formData.append('description', values.description);
		values.serviceDescription &&
			formData.append('serviceDescription', values.serviceDescription);
		values.status && formData.append('status', values.status);
		values.slug && formData.append('slug', values.slug);

		const headers = {
			'Content-Type': undefined, // Overwrite application/json
		};

		const response: VisitorSpaceInfo = await ApiService.getApi()
			.post(VISITOR_SPACE_SERVICE_BASE_URL, { body: formData, headers })
			.json();

		await this.queryClient.invalidateQueries([QUERY_KEYS.getContentPartners]);

		return response;
	}

	public static async update(
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
		values.description && formData.append('description', values.description);
		values.serviceDescription &&
			formData.append('serviceDescription', values.serviceDescription);
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
