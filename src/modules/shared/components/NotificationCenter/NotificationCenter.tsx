import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { partition } from 'lodash';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Loading } from '@shared/components';
import { NOTIFICATION_TYPE_TO_PATH } from '@shared/components/NotificationCenter/NotificationCenter.consts';
import { useWindowSize } from '@shared/hooks/use-window-size';
import {
	Notification,
	NotificationStatus,
} from '@shared/services/notifications-service/notifications.types';
import { toastService } from '@shared/services/toast-service';

import { Blade } from '../Blade';
import { Icon } from '../Icon';

import styles from './NotificationCenter.module.scss';
import { NotificationCenterProps } from './NotificationCenter.types';

const NotificationCenter: FC<NotificationCenterProps> = ({
	className,
	isOpen,
	onClose,
	useGetNotificationsHook,
	useMarkOneNotificationsAsReadHook,
	useMarkAllNotificationsAsReadHook,
}) => {
	const { t } = useTranslation();
	const windowSize = useWindowSize();

	const {
		data: notificationResponse,
		fetchNextPage,
		isError,
		isLoading,
		refetch: refetchNotifications,
	} = useGetNotificationsHook(isOpen);
	const { mutateAsync: markOneNotificationAsRead } = useMarkOneNotificationsAsReadHook();
	const { mutateAsync: markAllNotificationsAsRead } = useMarkAllNotificationsAsReadHook();

	/**
	 * Keeps a cache of the notification read status when the user marks a notification as read.
	 * This ensures we don't need to refetch all notifications causing the scrollable to jump
	 */
	const [notificationReadStatus, setNotificationReadStatus] = useState<
		Record<string, NotificationStatus>
	>({});

	const getNotificationStatus = (notification: Notification) => {
		return notificationReadStatus[notification.id] || notification.status;
	};

	const notifications =
		notificationResponse?.pages?.flatMap((notificationPage) => notificationPage.items) || [];
	const [unreadNotifications, readNotifications] = partition(
		notifications || [],
		(notification) => getNotificationStatus(notification) === NotificationStatus.UNREAD
	);

	const onMarkOneAsRead = async (notificationId: string) => {
		try {
			await markOneNotificationAsRead(notificationId);
			setNotificationReadStatus((oldValue) => {
				return {
					...oldValue,
					[notificationId]: NotificationStatus.READ,
				};
			});
		} catch (err) {
			console.error({
				message: 'Failed to mark all notifications as read',
				error: err,
			});
			toastService.notify({
				title: t(
					'modules/shared/components/notification-center/notification-center___error'
				),
				description: t(
					'modules/shared/components/notification-center/notification-center___het-markeren-van-alle-notificaties-al-gelezen-is-mislukt'
				),
			});
		}
	};

	const onMarkAllAsRead = async () => {
		try {
			await markAllNotificationsAsRead();
			await refetchNotifications();
			setNotificationReadStatus({});
			toastService.notify({
				title: t(
					'modules/shared/components/notification-center/notification-center___success'
				),
				description: t(
					'modules/shared/components/notification-center/notification-center___alle-notificaties-zijn-gemarkeerd-als-gelezen'
				),
			});
		} catch (err) {
			console.error({
				message: 'Failed to mark all notifications as read',
				error: err,
			});
			toastService.notify({
				title: t(
					'modules/shared/components/notification-center/notification-center___error'
				),
				description: t(
					'modules/shared/components/notification-center/notification-center___het-markeren-van-alle-notificaties-al-gelezen-is-mislukt'
				),
			});
		}
	};

	const onClickNotificationLink = async (notification: Notification) => {
		await onMarkOneAsRead(notification.id);
		onClose();
	};

	const getPath = (notification: Notification): string | null => {
		return (
			NOTIFICATION_TYPE_TO_PATH[notification.type]
				?.replace('{visitRequestId}', notification.visitId)
				?.replace('{readingRoomId}', notification.readingRoomId) || null
		);
	};

	const renderNotificationLink = (notification: Notification) => {
		const notificationLinkContent = (
			<>
				<b
					className={clsx(
						'u-font-size-14',
						styles['c-notification-center__notification-title']
					)}
				>
					{notification.title}
				</b>
				{notification.description}
			</>
		);

		// Wrap in link if notification should link to somewhere
		const notificationLink: string | null = getPath(notification);
		return (
			<div
				className={clsx(styles['c-notification-center__notification-link'], {
					[styles['c-notification-center__notification-link-clickable']]:
						notificationLink,
				})}
			>
				{notificationLink ? (
					<Link passHref href={notificationLink}>
						<a onClick={() => onClickNotificationLink(notification)}>
							{notificationLinkContent}
						</a>
					</Link>
				) : (
					notificationLinkContent
				)}
			</div>
		);
	};

	const renderNotification = (notification: Notification) => {
		if (getNotificationStatus(notification) === NotificationStatus.UNREAD) {
			return (
				<div
					className={clsx(
						styles['c-notification-center__notification'],
						styles['c-notification-center__notification--unread']
					)}
					key={`notification-${notification.id}`}
				>
					{renderNotificationLink(notification)}
					<Button
						onClick={() => onMarkOneAsRead(notification.id)}
						className={clsx(styles['c-notification-center__notification-icon'])}
						title={t(
							'modules/shared/components/notification-center/notification-center___markeer-als-gelezen'
						)}
						icon={<Icon name="check" />}
						variants="text"
					/>
				</div>
			);
		} else {
			return (
				<div
					className={clsx(
						styles['c-notification-center__notification'],
						styles['c-notification-center__notification--read']
					)}
					key={`notification-${notification.id}`}
				>
					{renderNotificationLink(notification)}
				</div>
			);
		}
	};

	const renderFooter = () => (
		<Button
			disabled={!unreadNotifications.length}
			onClick={onMarkAllAsRead}
			className={styles['c-notification-center__button']}
			variants={['black', 'block']}
			iconStart={<Icon name="check" />}
			title={
				unreadNotifications.length > 0
					? t(
							'modules/shared/components/notification-center/notification-center___markeer-alle-notificaties-als-gelezen'
					  )
					: t(
							'modules/shared/components/notification-center/notification-center___alle-notificaties-zijn-reeds-gelezen'
					  )
			}
			label={t(
				'modules/shared/components/notification-center/notification-center___markeer-alles-als-gelezen'
			)}
		/>
	);

	const scrollableHeight = (windowSize?.height || 929) - 88 - 93; // Header and mark all as read button
	return (
		<Blade
			className={clsx(className, styles['c-notification-center__blade'])}
			isOpen={isOpen}
			onClose={onClose}
			hideCloseButton
			footer={renderFooter()}
		>
			{isLoading && <Loading />}
			{isError && (
				<div>
					{t(
						'modules/shared/components/notification-center/notification-center___er-ging-iets-mis-bij-het-ophalen-van-je-notificaties'
					)}
				</div>
			)}
			{!isLoading && !isError && (
				<InfiniteScroll
					className={styles['c-notification-center__infinite-scroll']}
					dataLength={notifications?.length || 0}
					next={() => fetchNextPage()}
					hasMore={(notificationResponse?.pages[0].total || 0) > notifications.length}
					loader={
						<Loading
							className={styles['c-notification-center__infinite-scroll-loading']}
						/>
					}
					height={scrollableHeight}
				>
					<div className={styles['c-notification-center']}>
						{!!unreadNotifications.length && (
							<div className={styles['c-notification-center__unread']}>
								<b>
									{t(
										'modules/shared/components/notification-center/notification-center___ongelezen'
									)}
								</b>
								{unreadNotifications.map(renderNotification)}
							</div>
						)}
						{!!readNotifications.length && (
							<div className={styles['c-notification-center__read']}>
								<b>
									{t(
										'modules/shared/components/notification-center/notification-center___gelezen'
									)}
								</b>
								{readNotifications.map(renderNotification)}
							</div>
						)}
					</div>
				</InfiniteScroll>
			)}
		</Blade>
	);
};

export default NotificationCenter;
