import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type GetMaterialRequestsProps, MaintenanceAlertsService } from '../services';
import type { Alert } from '../types';

export const useGetActiveMaintenanceAlerts = (
	props?: GetMaterialRequestsProps,
	options: {
		enabled?: boolean;
	} = {}
): UseQueryResult<IPagination<Alert>, unknown> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaintenanceAlerts, props],
		queryFn: () => MaintenanceAlertsService.getAllActive(props),
		enabled: true,
		placeholderData: keepPreviousData,
		...options,
	});
