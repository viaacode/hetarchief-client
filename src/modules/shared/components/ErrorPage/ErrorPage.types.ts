import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ErrorPageProps extends DefaultComponentProps {
	children?: React.ReactNode;
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
