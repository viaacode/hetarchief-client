import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { GetMaterialRequestsProps, MaintenanceAlertsService } from '../services';
import { Alert } from '../types';

export const useGetActiveMaintenanceAlerts = (
	props?: GetMaterialRequestsProps
): UseQueryResult<IPagination<Alert>> =>
	useQuery(
		[QUERY_KEYS.getMaintenanceAlerts, props],
		() => MaintenanceAlertsService.getAllActive(props),
		{
			keepPreviousData: true,
		}
	);
