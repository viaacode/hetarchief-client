import type { OrderDirection } from '@meemoo/react-components';
import type { ReactNode } from 'react';

export enum MaintenanceAlertsOrderProps {
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
	orderDirection?: OrderDirection;
}
