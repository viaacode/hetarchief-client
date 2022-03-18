import { DefaultComponentProps, VisitStatus } from '@shared/types';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	status: VisitStatus;
}
