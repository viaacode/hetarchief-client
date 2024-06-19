import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

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
