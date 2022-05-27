import { DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceNavigationProps extends DefaultComponentProps {
	backLink?: string;
	email?: string;
	phone?: string;
	showAccessEndDate?: string;
	showBorder: boolean;
	title?: string;
}
