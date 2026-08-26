export interface NavItemsRightLoggedIn {
	hasUnreadNotifications: boolean;
	hasUnreadOutgoingMaterialRequestMessages: boolean;
	hasUnreadIncomingMaterialRequestMessages: boolean;
	notificationsOpen: boolean;
	userName: string;
	onLogOutClick: () => void;
	setNotificationsOpen: (show: boolean) => void;
}
