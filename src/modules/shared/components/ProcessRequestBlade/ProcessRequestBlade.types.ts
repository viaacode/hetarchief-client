import { type ReactNode } from 'react';

import { type BladeProps } from '@shared/components/Blade/Blade.types';
import { type Visit } from '@shared/types/visit';

export interface ProcessRequestBladeProps extends BladeProps {
	children?: ReactNode;
	selected?: Visit;
	onFinish?: () => void;
}
