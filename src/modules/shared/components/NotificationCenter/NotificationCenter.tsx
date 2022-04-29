import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { partition } from 'lodash-es';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Loading } from '@shared/components';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import {
	Notification,
	NotificationStatus,
} from '@shared/services/notifications-service/notifications.types';
import { toastService } from '@shared/services/toast-service';

import { Blade } from '../Blade';
import { Icon } from '../Icon';
import { UnreadMarker } from '../UnreadMarker';

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

	const [unread, read] = partition(
		notifications,
		(notification) => getNotificationStatus(notification) === NotificationStatus.UNREAD
	);

	const onMarkOneAsRead = async (notificationId: string) => {
		try {
			await markOneNotificationAsRead(notificationId);

			setNotificationReadStatus((oldValue) => ({
				...oldValue,
				[notificationId]: NotificationStatus.READ,
			}));
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

	const renderLink = (notification: Notification) => {
		const content = (
			<article className={styles['c-notification-center__row-content']}>
				<h5 className={styles['c-notification-center__row-title']}>
					<UnreadMarker
						className={styles['c-notification-center__row-marker']}
						active={getNotificationStatus(notification) === NotificationStatus.UNREAD}
					/>

					{notification.title}
				</h5>

				<span className="u-color-neutral">{notification.description}</span>
			</article>
		);

		// Wrap in link if notification should link to somewhere
		const path: string | null = NotificationsService.getPath(notification);

		if (!path) {
			return content;
		}

		return (
			<Link passHref href={path}>
				<a
					className="u-text-no-decoration"
					onClick={() => onClickNotificationLink(notification)}
				>
					{content}
				</a>
			</Link>
		);
	};

	const renderFooter = () => (
		<Button
			disabled={!unread.length}
			onClick={onMarkAllAsRead}
			className={styles['c-notification-center__button']}
			variants={['black', 'block']}
			iconStart={<Icon name="check" />}
			title={
				unread.length > 0
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

	return (
		<Blade
			className={clsx(className, styles['c-notification-center'])}
			isOpen={isOpen}
			onClose={onClose}
			hideCloseButton
			footer={renderFooter()}
		>
			{isLoading && <Loading />}

			{isError && (
				<p>
					{t(
						'modules/shared/components/notification-center/notification-center___er-ging-iets-mis-bij-het-ophalen-van-je-notificaties'
					)}
				</p>
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
				>
					{!!unread.length && (
						<div className={styles['c-notification-center__unread']}>
							<h4 className={styles['c-notification-center__header']}>
								{t(
									'modules/shared/components/notification-center/notification-center___ongelezen'
								)}
							</h4>

							{unread.map((notification) => (
								<div
									className={clsx(
										styles['c-notification-center__row'],
										styles['c-notification-center__row--unread']
									)}
									key={`notification-${notification.id}`}
								>
									{renderLink(notification)}

									<Button
										onClick={() => onMarkOneAsRead(notification.id)}
										className={clsx(
											styles['c-notification-center__row-button']
										)}
										title={t(
											'modules/shared/components/notification-center/notification-center___markeer-als-gelezen'
										)}
										icon={<Icon name="check" />}
										variants={['icon', 'sm', 'white']}
									/>
								</div>
							))}
						</div>
					)}

					{!!read.length && (
						<div className={styles['c-notification-center__read']}>
							<h4 className={styles['c-notification-center__header']}>
								{t(
									'modules/shared/components/notification-center/notification-center___gelezen'
								)}
							</h4>

							{read.map((notification) => (
								<div
									className={clsx(
										styles['c-notification-center__row'],
										styles['c-notification-center__row--read']
									)}
									key={`notification-${notification.id}`}
								>
									{renderLink(notification)}
								</div>
							))}
						</div>
					)}
				</InfiniteScroll>
			)}
		</Blade>
	);
};

export default NotificationCenter;
