import { RequestStatus } from '@cp/const/requests.const';
import { DefaultComponentProps } from '@shared/types';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	status: RequestStatus;
}
