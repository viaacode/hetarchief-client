import { i18n } from 'next-i18next';
import { NextRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { QueryClient } from 'react-query';

import { NOTIFICATION_TYPE_TO_PATH } from '@shared/components/NotificationCenter/NotificationCenter.consts';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import { ApiResponseWrapper } from '@shared/types';
import { asDate } from '@shared/utils';

import { MarkAllAsReadResult, Notification, NotificationStatus } from './notifications.types';

export abstract class NotificationsService {
	private static pollingTimer: number | null = null;
	private static lastFetchedUnreadNotifications: Notification[] | null = null;
	private static router: NextRouter | null = null;
	private static showNotificationsCenter: ((show: boolean) => void) | null = null;
	private static setHasUnreadNotifications: ((hasUnreadNotifications: boolean) => void) | null =
		null;

	private static queryClient = new QueryClient();

	public static async initPolling(
		router: NextRouter,
		showNotificationsCenter: (show: boolean) => void,
		setHasUnreadNotifications: (hasUnreadNotifications: boolean) => void
	): Promise<void> {
		this.router = router;
		this.showNotificationsCenter = showNotificationsCenter;
		this.setHasUnreadNotifications = setHasUnreadNotifications;
		if (!this.pollingTimer) {
			NotificationsService.pollingTimer = window.setInterval(this.checkNotifications, 15000);
			await this.checkNotifications();
		}
	}

	public static stopPolling(): void {
		if (this.pollingTimer) {
			clearInterval(this.pollingTimer);
		}
	}

	private static getPath(notification: Notification): string | null {
		return (
			NOTIFICATION_TYPE_TO_PATH[notification.type]
				?.replace('{visitRequestId}', notification.visitId)
				?.replace('{readingRoomId}', notification.readingRoomId) || null
		);
	}

	public static async checkNotifications(): Promise<void> {
		const mostRecent = asDate(
			NotificationsService.lastFetchedUnreadNotifications?.[0].createdAt
		);
		const lastCheckNotificationTime = mostRecent ? mostRecent.getTime() : 0;
		const notificationResponse = await NotificationsService.getNotifications(1, 20);
		const notifications = notificationResponse.items;
		const unreadNotifications = notifications.filter(
			(notification) => notification.status === NotificationStatus.UNREAD
		);
		const firstUnread = asDate(unreadNotifications[0].createdAt);

		if (
			unreadNotifications.length > 0 &&
			firstUnread &&
			lastCheckNotificationTime < firstUnread.getTime()
		) {
			// A more recent notification exists, we should notify the user of the new notifications
			const newNotifications = unreadNotifications.filter(
				(notification) =>
					new Date(notification.createdAt).getTime() > lastCheckNotificationTime
			);
			if (newNotifications.length === 1) {
				// one => show details on the one notification
				toastService.notify({
					title: newNotifications[0].title,
					description: newNotifications[0].description,
					buttonLabel:
						i18n?.t(
							'modules/shared/services/notifications-service/notifications___bekijk'
						) || 'Bekijk',
					onClose: async () => {
						const url = NotificationsService.getPath(newNotifications[0]);
						if (url) {
							// Go to page
							await NotificationsService.markOneAsRead(newNotifications[0].id);
							NotificationsService?.router?.push?.(url);
						} else {
							// Notification not clickable => open notification center
							NotificationsService.showNotificationsCenter?.(true);
						}
					},
				});
			} else {
				// multiple
				toastService.notify({
					title:
						i18n?.t(
							'modules/shared/services/notifications-service/notifications___er-zijn-amount-nieuwe-notificaties',
							{
								amount: newNotifications.length,
							}
						) || `Er zijn ${newNotifications.length} nieuwe notificaties`,
					description:
						i18n?.t(
							'modules/shared/services/notifications-service/notifications___er-zijn-aantal-nieuwe-notificaties-bekijk-ze-in-het-notificatie-overzicht',
							{ amount: newNotifications.length }
						) ||
						`Er zijn ${newNotifications.length} nieuwe notificaties. Bekijk ze in het notificatie overzicht.`,
					buttonLabel: i18n?.t(
						'modules/shared/services/notifications-service/notifications___bekijk'
					),
					onClose: () => {
						NotificationsService.showNotificationsCenter?.(true);
					},
				});
			}
		}
		if (unreadNotifications.length > 0) {
			NotificationsService.lastFetchedUnreadNotifications = unreadNotifications;
			NotificationsService.setHasUnreadNotifications?.(true);
			await NotificationsService.queryClient.invalidateQueries(QUERY_KEYS.getNotifications);
		}
	}

	public static async getNotifications(
		page: number,
		size: number
	): Promise<ApiResponseWrapper<Notification>> {
		const response: ApiResponseWrapper<Notification> = await ApiService.getApi()
			.get(stringifyUrl({ url: 'notifications', query: { page, size } }))
			.json();
		return response;
	}

	public static async markOneAsRead(notificationId: string): Promise<Notification> {
		const response: Notification = await ApiService.getApi()
			.patch(`notifications/${notificationId}/mark-as-read`)
			.json();
		if ((NotificationsService.lastFetchedUnreadNotifications?.length || 0) <= 1) {
			NotificationsService.setHasUnreadNotifications?.(false);
		}
		return response;
	}

	public static async markAllAsRead(): Promise<MarkAllAsReadResult> {
		const response: MarkAllAsReadResult = await ApiService.getApi()
			.patch('notifications/mark-as-read')
			.json();
		NotificationsService.setHasUnreadNotifications?.(false);
		return response;
	}
}
