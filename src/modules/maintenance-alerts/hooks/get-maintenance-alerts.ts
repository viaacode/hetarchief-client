import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { type GetMaterialRequestsProps, MaintenanceAlertsService } from '../services';
import { type Alert } from '../types';

export const useGetActiveMaintenanceAlerts = (
	props?: GetMaterialRequestsProps,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IPagination<Alert>, unknown> =>
	useQuery(
		[QUERY_KEYS.getMaintenanceAlerts, props],
		() => MaintenanceAlertsService.getAllActive(props),
		options
	);
