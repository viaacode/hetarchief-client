import { DefaultComponentProps } from '@shared/types';
import { VisitStatus } from '@visits/types';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	status: VisitStatus;
}
