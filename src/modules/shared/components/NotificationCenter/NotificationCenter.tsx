import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { partition } from 'lodash-es';
import getConfig from 'next/config';
import Link from 'next/link';
import { FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Loading, NotificationCenterProps } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import {
	Notification,
	NotificationStatus,
} from '@shared/services/notifications-service/notifications.types';
import { toastService } from '@shared/services/toast-service';

import { Blade } from '../Blade';
import Html from '../Html/Html';
import { Icon, IconNamesLight } from '../Icon';
import { UnreadMarker } from '../UnreadMarker';

import styles from './NotificationCenter.module.scss';

const { publicRuntimeConfig } = getConfig();

const NotificationCenter: FC<NotificationCenterProps> = ({
	className,
	isOpen,
	onClose,
	useGetNotificationsHook,
	useMarkOneNotificationsAsReadHook,
	useMarkAllNotificationsAsReadHook,
}) => {
	const { tHtml, tText } = useTranslation();

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
				title: tHtml(
					'modules/shared/components/notification-center/notification-center___error'
				),
				description: tHtml(
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
				title: tHtml(
					'modules/shared/components/notification-center/notification-center___success'
				),
				description: tHtml(
					'modules/shared/components/notification-center/notification-center___alle-notificaties-zijn-gemarkeerd-als-gelezen'
				),
			});
		} catch (err) {
			console.error({
				message: 'Failed to mark all notifications as read',
				error: err,
			});

			toastService.notify({
				title: tHtml(
					'modules/shared/components/notification-center/notification-center___error'
				),
				description: tHtml(
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

				<Html
					type="span"
					className="u-color-neutral u-text-default-font u-font-size-12"
					content={notification.description}
				/>
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
					aria-label={notification.title}
					target="_self"
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
			iconStart={<Icon name={IconNamesLight.Check} />}
			aria-label={tText(
				'modules/shared/components/notification-center/notification-center___markeer-alle-notificaties-als-gelezen'
			)}
			title={
				unread.length > 0
					? tText(
							'modules/shared/components/notification-center/notification-center___markeer-alle-notificaties-als-gelezen'
					  )
					: tText(
							'modules/shared/components/notification-center/notification-center___alle-notificaties-zijn-reeds-gelezen'
					  )
			}
			label={tHtml(
				'modules/shared/components/notification-center/notification-center___markeer-alles-als-gelezen'
			)}
		/>
	);

	const renderBladeContent = () => {
		if (isLoading) {
			return <Loading owner="notification center" />;
		}

		if (isError) {
			return (
				<p>
					{tHtml(
						'modules/shared/components/notification-center/notification-center___er-ging-iets-mis-bij-het-ophalen-van-je-notificaties'
					)}
				</p>
			);
		}

		if (notifications.length === 0) {
			return (
				<div className={styles['c-notification-center__empty']}>
					<h4 className={styles['c-notification-center__header']}>
						{tHtml(
							'modules/shared/components/notification-center/notification-center___er-zijn-nog-geen-notificaties'
						)}
					</h4>
				</div>
			);
		}

		return (
			<InfiniteScroll
				className={styles['c-notification-center__infinite-scroll']}
				dataLength={notifications?.length || 0}
				next={() => fetchNextPage()}
				hasMore={(notificationResponse?.pages[0].total || 0) > notifications.length}
				loader={
					<Loading
						className={styles['c-notification-center__infinite-scroll-loading']}
						owner="notification center: infinite scroll loader"
					/>
				}
			>
				{!!unread.length && (
					<div className={styles['c-notification-center__unread']}>
						<h4 className={styles['c-notification-center__header']}>
							{tHtml(
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
									className={clsx(styles['c-notification-center__row-button'])}
									title={tText(
										'modules/shared/components/notification-center/notification-center___markeer-als-gelezen'
									)}
									icon={<Icon name={IconNamesLight.Check} aria-hidden />}
									aria-label={tText(
										'modules/shared/components/notification-center/notification-center___markeer-als-gelezen'
									)}
									variants={['icon', 'sm', 'white']}
								/>
							</div>
						))}
					</div>
				)}

				{!!read.length && (
					<div className={styles['c-notification-center__read']}>
						<h4 className={styles['c-notification-center__header']}>
							{tHtml(
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
		);
	};

	return (
		<Blade
			className={clsx(className, styles['c-notification-center'])}
			footer={renderFooter()}
			isOpen={isOpen}
			onClose={onClose}
			renderTitle={(props) => (
				<h3 {...props} className={clsx(props.className, 'u-display-none')}>
					{tText(
						'modules/shared/components/notification-center/notification-center___notificaties'
					)}
				</h3>
			)}
			showCloseButtonOnTop
		>
			{renderBladeContent()}
		</Blade>
	);
};

export default NotificationCenter;
