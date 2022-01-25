import { DefaultComponentProps } from '@shared/types';

export interface NotificationCenterProps extends DefaultComponentProps {
	notifications: Notification[];
	isOpen: boolean;
	readTitle: string;
	unreadTitle: string;
	onClose: () => void;
	onClickNotification: (id: string) => void;
	onClickButton: () => void;
}

export interface Notification {
	title: string;
	description: string;
	read: boolean;
	id: string;
}
