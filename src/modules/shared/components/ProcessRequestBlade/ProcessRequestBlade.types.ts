import { type ReactNode } from 'react';

import { type BladeProps } from '@shared/components/Blade/Blade.types';
import { type VisitRequest } from '@shared/types/visit-request';

export interface ProcessRequestBladeProps extends BladeProps {
	children?: ReactNode;
	selected?: VisitRequest;
	onFinish?: () => void;
}
