import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface NotificationCenterProps extends DefaultComponentProps {
	notifications: Notification[];
	isOpen: boolean;
	onClose: () => void;
	onClickNotification: (id: string) => void;
	onClickButton: () => void;
}

export interface Notification {
	title: string;
	description: ReactNode;
	read: boolean;
	id: string;
}
