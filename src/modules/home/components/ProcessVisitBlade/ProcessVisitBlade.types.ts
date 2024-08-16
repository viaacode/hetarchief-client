import { type ReactNode } from 'react';

import { type BladeProps } from '@shared/components/Blade/Blade.types';
import { type VisitSummaryType } from '@shared/components/VisitSummary';
import { type VisitRequest } from '@shared/types/visit-request';
// TODO: add spaceDescription

// TODO: add spaceDescription
export interface ProcessVisitBladeProps extends BladeProps {
	children?: ReactNode;
	selected?: VisitSummaryType & Pick<VisitRequest, 'status'>;
	onFinish?: () => void;
}
