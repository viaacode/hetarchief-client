import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { MaintenanceAlertsService } from '../services';

export const useDismissMaintenanceAlert = (): UseMutationResult<void, unknown, string> =>
	useMutation((maintenanceAlertId: string) =>
		MaintenanceAlertsService.dismissMaintenanceAlert(maintenanceAlertId)
	);
