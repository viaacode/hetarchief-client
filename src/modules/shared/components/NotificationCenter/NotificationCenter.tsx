import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Blade } from '../Blade';
import { Icon } from '../Icon';

import styles from './NotificationCenter.module.scss';
import { Notification, NotificationCenterProps } from './NotificationCenter.types';

const NotificationCenter: FC<NotificationCenterProps> = ({
	className,
	notifications,
	isOpen,
	onClose,
	onClickNotification,
	onClickButton,
}) => {
	const { t } = useTranslation();

	const filteredNotifications = (read: boolean) =>
		notifications.filter((notification) => notification.read === read);

	const unreadNotifications = filteredNotifications(false);
	const readNotifications = filteredNotifications(true);

	const renderReadNotifications = (notifications: Notification[]) => {
		return notifications.map((notification) => {
			return (
				<div
					className={clsx(
						styles['c-notification-center__notification'],
						styles['c-notification-center__notification--read']
					)}
					key={`notification-${notification.id}`}
				>
					<b
						className={clsx(
							'u-font-size-14',
							styles['c-notification-center__notification-title']
						)}
					>
						{notification.title}
					</b>
					<p className="u-font-size-14 u-color-neutral u-line-height-13">
						{notification.description}
					</p>
				</div>
			);
		});
	};

	const renderUnreadNotifications = (notifications: Notification[]) => {
		return notifications.map((notification) => {
			return (
				<div
					className={clsx(
						styles['c-notification-center__notification'],
						styles['c-notification-center__notification--unread']
					)}
					key={`notification-${notification.id}`}
				>
					<b
						className={clsx(
							'u-font-size-14',
							styles['c-notification-center__notification-title']
						)}
					>
						{notification.title}
					</b>
					<p className="u-font-size-14 u-color-neutral u-line-height-13">
						{notification.description}
					</p>
					<Button
						onClick={() => onClickNotification(notification.id)}
						className={clsx(styles['c-notification-center__notification-icon'])}
						title="check"
						icon={<Icon name="check" />}
						variants="text"
					/>
				</div>
			);
		});
	};

	const renderFooter = () => (
		<Button
			disabled={!unreadNotifications.length}
			onClick={onClickButton}
			className={styles['c-notification-center__button']}
			variants={['black', 'block']}
			iconStart={<Icon name="check" />}
			label={t(
				'modules/shared/components/notification-center/notification-center___markeer-alles-als-gelezen'
			)}
		/>
	);

	return (
		<Blade
			className={clsx(className, styles['c-notification-center__blade'])}
			isOpen={isOpen}
			onClose={onClose}
			hideCloseButton
			footer={renderFooter()}
		>
			<div className={styles['c-notification-center']}>
				{!!unreadNotifications.length && (
					<div className={styles['c-notification-center__unread']}>
						<b>
							{t(
								'modules/shared/components/notification-center/notification-center___ongelezen'
							)}
						</b>
						{renderUnreadNotifications(unreadNotifications)}
					</div>
				)}
				{!!readNotifications.length && (
					<div className={styles['c-notification-center__read']}>
						<b>
							{t(
								'modules/shared/components/notification-center/notification-center___gelezen'
							)}
						</b>
						{renderReadNotifications(readNotifications)}
					</div>
				)}
			</div>
		</Blade>
	);
};

export default NotificationCenter;
