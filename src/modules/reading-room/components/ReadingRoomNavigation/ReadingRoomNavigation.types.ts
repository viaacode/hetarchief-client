import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomNavigationProps extends DefaultComponentProps {
	title?: string;
	backLink?: string;
	showAccessEndDate?: string;
	showBorder: boolean;
}
