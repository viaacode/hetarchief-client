import { OrderDirection } from '@meemoo/react-components';

export enum MaintenanceAlertsOrderProps {
	Id = 'id',
	Icon = 'icon',
	FromDate = 'fromDate',
	UntilDate = 'untilDate',
	Active = 'active',
}

export interface GetMaterialRequestsProps {
	page?: number;
	orderProp?: MaintenanceAlertsOrderProps;
	orderDirection?: OrderDirection;
}
