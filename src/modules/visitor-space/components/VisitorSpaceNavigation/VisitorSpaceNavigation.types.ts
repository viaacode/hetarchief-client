import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceNavigationProps extends DefaultComponentProps {
	children?: React.ReactNode;
	backLink?: string;
	email?: string;
	phone?: string;
	accessEndDate?: string | ReactNode;
	showContactInfo?: boolean;
	title?: ReactNode;
}
