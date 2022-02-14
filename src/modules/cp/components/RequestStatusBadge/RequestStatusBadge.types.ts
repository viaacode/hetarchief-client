import { RequestStatus } from '@cp/types';
import { DefaultComponentProps } from '@shared/types';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	status: RequestStatus;
}
