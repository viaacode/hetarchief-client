import { ReactNode } from 'react';

import { BladeProps } from '@shared/components';

export interface FormBladeProps<T> extends BladeProps {
	children?: ReactNode;
	onSubmit?: (values: T) => Promise<void>;
}
