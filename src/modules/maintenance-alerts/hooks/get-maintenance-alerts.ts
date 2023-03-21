import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { GetMaterialRequestsProps, MaintenanceAlertsService } from '../services';
import { Alert } from '../types';

export const useGetMaintenanceAlerts = (
	props?: GetMaterialRequestsProps
): UseQueryResult<IPagination<Alert>> =>
	useQuery(
		[QUERY_KEYS.getMaintenanceAlerts, props],
		() => MaintenanceAlertsService.getAll(props),
		{
			keepPreviousData: true,
		}
	);
