import { Dispatch, SetStateAction } from 'react';

export interface NavItemsRightLoggedIn {
	anyUnreadNotifications: boolean;
	notificationsOpen: boolean;
	userName: string;
	onLogOutClick: () => void;
	setNotificationsOpen: Dispatch<SetStateAction<boolean>>;
}
