import type { IPagination } from '@studiohyperdrive/pagination';
import { QueryClient } from '@tanstack/react-query';
import type { NextRouter } from 'next/router';
import { stringifyUrl } from 'query-string';

import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { tText } from '@shared/helpers/translate';
import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import { asDate } from '@shared/utils/dates';

import { GET_PATH_FROM_NOTIFICATION_TYPE } from './notifications.consts';
import {
	type MarkAllAsReadResult,
	type Notification,
	NotificationStatus,
	NotificationType,
} from './notifications.types';

export namespace NotificationsService {
	let _pollingTimer: number | null = null;
	let _lastNotifications: Notification[] | null = null;
	let _router: NextRouter | null = null;
	let _showNotificationsCenter: ((show: boolean) => void) | null = null;
	let _setHasUnreadNotifications: ((hasUnreadNotifications: boolean) => void) | null = null;

	let _queryClient = new QueryClient();

	export async function setQueryClient(queryClient: QueryClient): Promise<void> {
		_queryClient = queryClient;
	}

	export async function initPolling(
		router: NextRouter,
		showNotificationsCenter: (show: boolean) => void,
		setHasUnreadNotifications: (hasUnreadNotifications: boolean) => void
	): Promise<void> {
		_router = router;
		_showNotificationsCenter = showNotificationsCenter;
		_setHasUnreadNotifications = setHasUnreadNotifications;
		if (!_pollingTimer && process.env.NODE_ENV !== 'test') {
			_pollingTimer = window.setInterval(checkNotifications, 15000);
			await checkNotifications();
		}
	}

	export function stopPolling(): void {
		if (_pollingTimer) {
			clearInterval(_pollingTimer);
		}
	}

	export function resetService(): void {
		_pollingTimer = null;
		_lastNotifications = null;
		_router = null;
		_showNotificationsCenter = null;
		_setHasUnreadNotifications = null;
	}

	export function getPath(notification: Notification): string | null {
		return (
			GET_PATH_FROM_NOTIFICATION_TYPE()
				[notification.type]?.replace('{visitRequestId}', notification.visitId)
				?.replace('{slug}', notification.visitorSpaceSlug) || null
		);
	}

	export async function checkNotifications(): Promise<void> {
		const locale = TranslationService.getLocale();
		const mostRecent = asDate(_lastNotifications?.[0]?.createdAt);
		const lastCheckNotificationTime = mostRecent ? mostRecent.getTime() : 0;
		const notificationResponse = await getNotifications(1, 20);
		const notifications = notificationResponse.items;
		const unreadNotifications = notifications.filter(
			(notification) => notification.status === NotificationStatus.UNREAD
		);
		const firstUnread = asDate(unreadNotifications?.[0]?.createdAt);

		if (
			!!_lastNotifications && // Do not show notifications if this is the first time we check since loading the site
			firstUnread && // There is at least one unread notification
			(!mostRecent || lastCheckNotificationTime < firstUnread.getTime()) // The most recent unread notification was added since the last time we checked
		) {
			// A more recent notification exists, we should notify the user of the new notifications
			const newNotifications = unreadNotifications.filter(
				(notification) => new Date(notification.createdAt).getTime() > lastCheckNotificationTime
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
					(await _queryClient.invalidateQueries([QUERY_KEYS.getAccessibleVisitorSpaces]));

				if (
					newNotifications.find(
						(notification) =>
							notification.type === NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED
					)
				) {
					// Redirect the user to the homepage
					_router?.push?.(ROUTES_BY_LOCALE[locale].home);
				}
			}

			if (newNotifications.length === 1) {
				// one => show details on the one notification
				toastService.notify({
					title: newNotifications[0].title,
					description: newNotifications[0].description,
					buttonLabel: tText(
						'modules/shared/services/notifications-service/notifications___bekijk'
					),
					onClose: async () => {
						const url = getPath(newNotifications[0]);
						if (url) {
							// Go to page
							await markOneAsRead(newNotifications[0].id);
							if (url.includes('//')) {
								// If absolute url, we want to reload the whole page, so ensure all visitor spaces are reloaded
								window.open(url, '_self');
							} else {
								_router?.push?.(url);
							}
						} else {
							// Notification not clickable => open notification center
							_showNotificationsCenter?.(true);
						}
					},
				});
			} else {
				// multiple
				toastService.notify({
					title: tText(
						'modules/shared/services/notifications-service/notifications___er-zijn-amount-nieuwe-notificaties',
						{
							amount: newNotifications.length,
						}
					),
					description: tText(
						'modules/shared/services/notifications-service/notifications___er-zijn-aantal-nieuwe-notificaties-bekijk-ze-in-het-notificatie-overzicht',
						{ amount: newNotifications.length }
					),
					buttonLabel: tText(
						'modules/shared/services/notifications-service/notifications___bekijk'
					),
					onClose: () => {
						_showNotificationsCenter?.(true);
					},
				});
			}
		}
		_lastNotifications = notifications;
		if (unreadNotifications.length > 0) {
			_setHasUnreadNotifications?.(true);
			await _queryClient.invalidateQueries([QUERY_KEYS.getNotifications]);
		}
	}

	export async function getNotifications(
		page: number,
		size: number
	): Promise<IPagination<Notification>> {
		return await ApiService.getApi()
			.get(stringifyUrl({ url: 'notifications', query: { page, size } }))
			.json();
	}

	export async function markOneAsRead(notificationId: string): Promise<Notification> {
		const response: Notification = await ApiService.getApi()
			.patch(`notifications/${notificationId}/mark-as-read`)
			.json();
		if (
			(_lastNotifications?.filter(
				(notif) => notif.id !== notificationId && notif.status === NotificationStatus.UNREAD
			)?.length || 0) === 0
		) {
			_setHasUnreadNotifications?.(false);
		}
		return response;
	}

	export async function markAllAsRead(): Promise<MarkAllAsReadResult> {
		const response: MarkAllAsReadResult = await ApiService.getApi()
			.patch('notifications/mark-as-read')
			.json();
		_setHasUnreadNotifications?.(false);
		return response;
	}
}
