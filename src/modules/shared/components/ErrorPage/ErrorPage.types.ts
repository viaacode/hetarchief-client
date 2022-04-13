import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ErrorPageProps extends DefaultComponentProps {
	title?: string;
	description?: string;
	link?: {
		component: ReactNode;
		to: string;
	};
	image?: {
		image: string;
		left?: boolean;
	};
}
