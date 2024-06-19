import { type ReactNode } from 'react';

import { type DefaultComponentProps, type VisitStatus } from '@shared/types';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	children?: ReactNode;
	status: VisitStatus;
}
