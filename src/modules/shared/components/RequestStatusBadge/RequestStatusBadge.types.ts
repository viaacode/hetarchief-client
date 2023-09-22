import { DefaultComponentProps, VisitStatus } from '@shared/types';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	children?: React.ReactNode;
	status: VisitStatus;
}
