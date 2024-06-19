import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceNavigationProps extends DefaultComponentProps {
	children?: ReactNode;
	backLink?: string;
	email?: string;
	phone?: string;
	accessEndDate?: string | ReactNode;
	showContactInfo?: boolean;
	title?: ReactNode;
}
