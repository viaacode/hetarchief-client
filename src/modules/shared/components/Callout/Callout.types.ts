import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface CalloutProps extends DefaultComponentProps {
	children?: ReactNode;
	icon?: ReactNode;
	text: string | ReactNode;
	action?: ReactNode;
}
