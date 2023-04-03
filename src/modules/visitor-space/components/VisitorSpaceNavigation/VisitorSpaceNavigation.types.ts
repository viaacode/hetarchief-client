import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceNavigationProps extends DefaultComponentProps {
	backLink?: string;
	email?: string;
	phone?: string;
	accessEndDate?: string | ReactNode;
	showBorder: boolean;
	title?: ReactNode;
}
