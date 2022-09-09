import { NextRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { QueryClient } from 'react-query';

import { ROUTES } from '@shared/const';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import { TranslationService } from '@shared/services/translation-service/translation-service';
import { ApiResponseWrapper } from '@shared/types';
import { asDate } from '@shared/utils';

import { NOTIFICATION_TYPE_TO_PATH } from './notifications.consts';
import {
	MarkAllAsReadResult,
	Notification,
	NotificationStatus,
	NotificationType,
} from './notifications.types';

export abstract class NotificationsService {
	private static pollingTimer: number | null = null;
	private static lastNotifications: Notification[] | null = null;
	private static router: NextRouter | null = null;
	private static showNotificationsCenter: ((show: boolean) => void) | null = null;
	private static setHasUnreadNotifications: ((hasUnreadNotifications: boolean) => void) | null =
		null;

	private static queryClient = new QueryClient();

	public static async setQueryClient(queryClient: QueryClient): Promise<void> {
		this.queryClient = queryClient;
	}

	public static async initPolling(
		router: NextRouter,
		showNotificationsCenter: (show: boolean) => void,
		setHasUnreadNotifications: (hasUnreadNotifications: boolean) => void
	): Promise<void> {
		this.router = router;
		this.showNotificationsCenter = showNotificationsCenter;
		this.setHasUnreadNotifications = setHasUnreadNotifications;
		if (!this.pollingTimer && process.env.NODE_ENV !== 'test') {
			NotificationsService.pollingTimer = window.setInterval(this.checkNotifications, 15000);
			await this.checkNotifications();
		}
	}

	public static stopPolling(): void {
		if (this.pollingTimer) {
			clearInterval(this.pollingTimer);
		}
	}

	public static resetService(): void {
		this.pollingTimer = null;
		this.lastNotifications = null;
		this.router = null;
		this.showNotificationsCenter = null;
		this.setHasUnreadNotifications = null;
	}

	public static getPath(notification: Notification): string | null {
		return (
			NOTIFICATION_TYPE_TO_PATH[notification.type]
				?.replace('{visitRequestId}', notification.visitId)
				?.replace('{slug}', notification.visitorSpaceSlug) || null
		);
	}

	public static async checkNotifications(): Promise<void> {
		const mostRecent = asDate(NotificationsService.lastNotifications?.[0]?.createdAt);
		const lastCheckNotificationTime = mostRecent ? mostRecent.getTime() : 0;
		const notificationResponse = await NotificationsService.getNotifications(1, 20);
		const notifications = notificationResponse.items;
		const unreadNotifications = notifications.filter(
			(notification) => notification.status === NotificationStatus.UNREAD
		);
		const firstUnread = asDate(unreadNotifications?.[0]?.createdAt);

		if (
			!!NotificationsService.lastNotifications && // Do not show notifications if this is the first time we check since loading the site
			firstUnread && // There is at least one unread notification
			(!mostRecent || lastCheckNotificationTime < firstUnread.getTime()) // The most recent unread notification was added since the last time we checked
		) {
			// A more recent notification exists, we should notify the user of the new notifications
			const newNotifications = unreadNotifications.filter(
				(notification) =>
					new Date(notification.createdAt).getTime() > lastCheckNotificationTime
			);

			// Refetch spaces on notification
			if (newNotifications.length) {
				const hasSpaceNotification = !!newNotifications.find((notification) => {
					return [
						NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED,
						NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED,
						NotificationType.VISIT_REQUEST_DENIED,
					].includes(notification.type);
				});

				hasSpaceNotification &&
					(await NotificationsService.queryClient.invalidateQueries(
						QUERY_KEYS.getAccessibleVisitorSpaces
					));

				if (
					newNotifications.find(
						(notification) =>
							notification.type === NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED
					)
				) {
					// Redirect the user to the homepage
					NotificationsService?.router?.push?.(ROUTES.home);
				}
			}

			if (newNotifications.length === 1) {
				// one => show details on the one notification
				toastService.notify({
					title: newNotifications[0].title,
					description: newNotifications[0].description,
					buttonLabel: TranslationService.getTranslation(
						'modules/shared/services/notifications-service/notifications___bekijk'
					),
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
					title: TranslationService.getTranslation(
						'modules/shared/services/notifications-service/notifications___er-zijn-amount-nieuwe-notificaties',
						{
							amount: newNotifications.length,
						}
					),
					description: TranslationService.getTranslation(
						'modules/shared/services/notifications-service/notifications___er-zijn-aantal-nieuwe-notificaties-bekijk-ze-in-het-notificatie-overzicht',
						{ amount: newNotifications.length }
					),
					buttonLabel: TranslationService.getTranslation(
						'modules/shared/services/notifications-service/notifications___bekijk'
					),
					onClose: () => {
						NotificationsService.showNotificationsCenter?.(true);
					},
				});
			}
		}
		NotificationsService.lastNotifications = notifications;
		if (unreadNotifications.length > 0) {
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
		if (
			(NotificationsService.lastNotifications?.filter(
				(notif) => notif.id !== notificationId && notif.status === NotificationStatus.UNREAD
			)?.length || 0) === 0
		) {
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
