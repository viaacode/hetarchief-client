import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ErrorPageProps extends DefaultComponentProps {
	title?: string;
	description?: string;
	button?: ReactNode;
	image?: string;
}
