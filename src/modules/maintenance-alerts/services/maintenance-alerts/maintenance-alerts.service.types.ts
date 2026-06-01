import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { ReactNode } from 'react';

enum MaintenanceAlertsOrderProps {
	Id = 'id',
	Icon = 'icon',
	FromDate = 'fromDate',
	UntilDate = 'untilDate',
	Active = 'active',
}

export interface GetMaterialRequestsProps {
	children?: ReactNode;
	page?: number;
	orderProp?: MaintenanceAlertsOrderProps;
	orderDirection?: AvoSearchOrderDirection;
}
