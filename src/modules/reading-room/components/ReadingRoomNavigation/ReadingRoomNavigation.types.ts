import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomNavigationProps extends DefaultComponentProps {
	email?: string;
	phone?: string;
	showAccessEndDate?: string;
	showBorder: boolean;
	title?: string;
}
