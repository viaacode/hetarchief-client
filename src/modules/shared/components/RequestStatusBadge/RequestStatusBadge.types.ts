import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';
import { type VisitStatus } from '@shared/types/visit-request';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	children?: ReactNode;
	status: VisitStatus;
}
