import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '..';
import { Blade } from '../Blade';

import styles from './NotificationCenter.module.scss';
import { Notification, NotificationCenterProps } from './NotificationCenter.types';

const NotificationCenters: FC<NotificationCenterProps> = ({
	className,
	notifications,
	isOpen,
	readTitle,
	unreadTitle,
	onClose,
	onClickNotification,
	onClickButton,
}) => {
	const filteredNotifications = (read: boolean) =>
		notifications.filter((notification) => notification.read === read);

	const renderReadNotifications = (notifications: Notification[]) => {
		return notifications.map((notification, index) => {
			return (
				<div
					className={clsx(
						styles['c-notification-center__notification'],
						styles['c-notification-center__notification--read']
					)}
					key={`notification-${index}`}
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
		return notifications.map((notification, index) => {
			return (
				<div
					className={clsx(
						styles['c-notification-center__notification'],
						styles['c-notification-center__notification--unread']
					)}
					key={`notification-${index}`}
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
			onClick={onClickButton}
			className={styles['c-notification-center__button']}
			variants={['black', 'block']}
			iconStart={
				<Icon
					className={clsx(styles['c-notification-center__notification-icon'])}
					name="check"
				/>
			}
			label="Markeer alles als gelezen"
		/>
	);

	return (
		<Blade
			className={className}
			isOpen={isOpen}
			onClose={onClose}
			hideCloseButton
			footer={renderFooter()}
		>
			<div className={styles['c-notification-center']}>
				{!!filteredNotifications(false).length && (
					<div className={styles['c-notification-center__unread']}>
						<b>{unreadTitle}</b>
						{renderUnreadNotifications(filteredNotifications(false))}
					</div>
				)}
				{!!filteredNotifications(true).length && (
					<div className={styles['c-notification-center__read']}>
						<b>{readTitle}</b>
						{renderReadNotifications(filteredNotifications(true))}
					</div>
				)}
			</div>
		</Blade>
	);
};

export default NotificationCenters;
