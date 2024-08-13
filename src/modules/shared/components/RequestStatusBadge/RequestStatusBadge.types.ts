import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';
import { type VisitStatus } from '@shared/types/visit';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	children?: ReactNode;
	status: VisitStatus;
}
