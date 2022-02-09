import { RequestStatus } from '@cp/const/requests.const';
import { DefaultComponentProps } from '@shared/types';

export interface RequestStatusChipProps extends DefaultComponentProps {
	status: RequestStatus;
}
