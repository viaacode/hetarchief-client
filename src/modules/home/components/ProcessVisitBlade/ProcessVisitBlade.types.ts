import type { BladeProps } from '@shared/components/Blade/Blade.types';
import type { VisitSummaryType } from '@shared/components/VisitSummary';
import type { VisitRequest } from '@shared/types/visit-request';
import type { ReactNode } from 'react';
// TODO: add spaceDescription

// TODO: add spaceDescription
export interface ProcessVisitBladeProps extends Omit<BladeProps, 'title' | 'footerButtons'> {
	children?: ReactNode;
	selected?: VisitSummaryType & Pick<VisitRequest, 'status'>;
	onFinish?: () => void;
}
