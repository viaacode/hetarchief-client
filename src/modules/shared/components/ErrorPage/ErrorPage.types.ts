import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface ErrorPageProps extends DefaultComponentProps {
	children?: ReactNode;
	title?: string | ReactNode;
	description?: string | ReactNode;
	link?: {
		component: ReactNode;
		to: string | null;
	};
	image?: {
		image: string;
		left?: boolean;
	};
	buttonsComponent?: ReactNode;
}
