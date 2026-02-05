import type { BladeProps } from '@shared/components/Blade/Blade.types';
import type { VisitRequest } from '@shared/types/visit-request';
import type { ReactNode } from 'react';

export interface ProcessRequestBladeProps extends Omit<BladeProps, 'title' | 'footerButtons'> {
	children?: ReactNode;
	selected?: VisitRequest;
	onFinish?: () => void;
}
