export interface NavItemsRightLoggedIn {
	hasUnreadNotifications: boolean;
	notificationsOpen: boolean;
	userName: string;
	onLogOutClick: () => void;
	setNotificationsOpen: (show: boolean) => void;
}
