import { i18n } from 'next-i18next';
import { Router } from 'next/router';
import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import { ApiResponseWrapper } from '@shared/types';

import { MarkAllAsReadResult, Notification, NotificationStatus } from './notifications.types';

export abstract class NotificationsService {
	private static pollingTimer: number | null = null;
	private static mostRecentVisibleNotification: Notification | null = null;
	private static router: Router | null = null;

	public static initPolling(router: Router): void {
		this.router = router;
		if (!this.pollingTimer) {
			NotificationsService.pollingTimer = window.setInterval(this.checkNotifications, 60000);
		}
	}

	public static async checkNotifications(): Promise<void> {
		const lastCheckNotificationTime = NotificationsService.mostRecentVisibleNotification?.showAt
			? new Date(NotificationsService.mostRecentVisibleNotification?.showAt).getTime()
			: 0;
		const notificationResponse = await NotificationsService.getNotifications(1, 20);
		const notifications = notificationResponse.items;
		const visibleNotifications = notifications.filter(
			(notification) => new Date(notification.showAt).getTime() < new Date().getTime()
		);
		const visibleUnreadNotifications = visibleNotifications.filter(
			(notification) => notification.status === NotificationStatus.UNREAD
		);

		if (
			visibleUnreadNotifications.length > 0 &&
			lastCheckNotificationTime < new Date(visibleUnreadNotifications[0].showAt).getTime()
		) {
			// A more recent notification exists, we should notify the user of the new notifications
			const newNotifications = visibleUnreadNotifications.filter(
				(notification) =>
					new Date(notification.showAt).getTime() > lastCheckNotificationTime
			);
			if (newNotifications.length === 1) {
				// one => show details on the one notification
				toastService.notify({
					title: newNotifications[0].title,
					description: newNotifications[0].description,
					buttonLabel: i18n?.t('Bekijk') || 'Bekijk',
					onClose: () => {
						this.router?.push(
							stringifyUrl({
								url: '/beheer/aanvragen',
								query: { visitRequest: newNotifications[0].visitId },
							})
						);
					},
				});
			} else {
				// multiple
				toastService.notify({
					title:
						i18n?.t('Er zijn {{amount}} nieuwe notificaties', {
							amount: newNotifications.length,
						}) || `Er zijn ${newNotifications.length} nieuwe notificaties`,
					description:
						i18n?.t(
							'Er zijn {{aantal}} nieuwe notificaties. Bekijk ze in het notificatie overzicht.',
							{ amount: newNotifications.length }
						) ||
						`Er zijn ${newNotifications.length} nieuwe notificaties. Bekijk ze in het notificatie overzicht.`,
					buttonLabel: i18n?.t('Bekijk'),
					onClose: () => {
						this.router?.push(
							stringifyUrl({
								url: this.router?.asPath,
								query: { showNotifications: true },
							})
						);
					},
				});
			}
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
		return response;
	}

	public static async markAllAsRead(): Promise<MarkAllAsReadResult> {
		const response: MarkAllAsReadResult = await ApiService.getApi()
			.patch('notifications/mark-as-read')
			.json();
		return response;
	}
}
