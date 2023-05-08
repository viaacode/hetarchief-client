import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ErrorPageProps extends DefaultComponentProps {
	title?: string | ReactNode;
	description?: string | ReactNode;
	link?: {
		component: ReactNode;
		to: string;
	};
	image?: {
		image: string;
		left?: boolean;
	};
	buttonsComponent?: ReactNode;
}
