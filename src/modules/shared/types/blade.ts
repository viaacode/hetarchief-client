import { type ReactNode } from 'react';

import { type BladeProps } from '@shared/components/Blade/Blade.types';

export interface FormBladeProps<T> extends BladeProps {
	children?: ReactNode;
	onSubmit?: (values: T) => Promise<void>;
}
