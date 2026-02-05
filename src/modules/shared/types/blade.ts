import type { BladeProps } from '@shared/components/Blade/Blade.types';
import type { ReactNode } from 'react';

export interface FormBladeProps<T> extends Omit<BladeProps, 'title' | 'footerButtons'> {
	children?: ReactNode;
	onSubmit?: (values: T) => Promise<void>;
}
