import type { ReactNode } from 'react';

export interface TabLabelProps {
	children?: ReactNode;
	count?: string | number;
	label: string | ReactNode;
	showCountOnMobile?: boolean;
}
