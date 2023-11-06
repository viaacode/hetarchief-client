import { ReactNode } from 'react';

export interface TabLabelProps {
	children?: React.ReactNode;
	count?: string | number;
	label: string | ReactNode;
}
