import { useMutation } from '@tanstack/react-query';

import { MaintenanceAlertsService } from '../services';

export const useDismissMaintenanceAlert = () =>
	useMutation({
		mutationFn: (maintenanceAlertId: string) =>
			MaintenanceAlertsService.dismissMaintenanceAlert(maintenanceAlertId),
	});
