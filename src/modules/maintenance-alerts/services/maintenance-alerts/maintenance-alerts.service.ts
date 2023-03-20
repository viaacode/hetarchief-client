import { IPagination } from '@studiohyperdrive/pagination';
import { QueryClient } from '@tanstack/react-query';
import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';

import { Alert } from '../../types';

import { MAINTENANCE_ALERTS_SERVICE_BASE_URL } from './maintenance-alerts.service.const';
import { GetMaterialRequestsProps } from './maintenance-alerts.service.types';

export class MaintenanceAlertsService {
	private static queryClient = new QueryClient();

	public static async getAll(
		{ orderProp, orderDirection, page }: GetMaterialRequestsProps = {
			page: 0,
		}
	): Promise<IPagination<Alert>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: MAINTENANCE_ALERTS_SERVICE_BASE_URL,
					query: {
						orderProp,
						orderDirection,
						page,
					},
				})
			)
			.json();
		return parsed as IPagination<Alert>;
	}

	public static async getAllActive(
		{ orderProp, orderDirection, page }: GetMaterialRequestsProps = {
			page: 0,
		}
	): Promise<IPagination<Alert>> {
		const parsed = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: MAINTENANCE_ALERTS_SERVICE_BASE_URL,
					query: {
						orderProp,
						orderDirection,
						page,
					},
				})
			)
			.json();
		return parsed as IPagination<Alert>;
	}
}
