import type { DefaultComponentProps } from '@shared/types';
import type { VisitStatus } from '@shared/types/visit-request';
import type { ReactNode } from 'react';

export interface RequestStatusBadgeProps extends DefaultComponentProps {
	children?: ReactNode;
	status: VisitStatus;
}
