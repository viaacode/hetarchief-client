import { type ReactNode } from 'react';

import { type BladeProps } from '@shared/components/Blade/Blade.types';
import { type VisitSummaryType } from '@shared/components/VisitSummary';
import { type Visit } from '@shared/types'; // TODO: add spaceDescription

// TODO: add spaceDescription
export interface ProcessVisitBladeProps extends BladeProps {
	children?: ReactNode;
	selected?: VisitSummaryType & Pick<Visit, 'status'>;
	onFinish?: () => void;
}
