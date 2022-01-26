import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import {
	Footer,
	Icon,
	Navigation,
	NavigationItem,
	NotificationCenter,
	notificationCenterMock,
} from '@shared/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@shared/components/Footer/__mocks__/footer';
import { MOCK_ITEMS_LEFT } from '@shared/components/Navigation/__mocks__/navigation';
import { NAV_HAMBURGER_PROPS } from '@shared/const';
import { setShowAuthModal } from '@shared/store/ui';

const AppLayout: FC = ({ children }) => {
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const { t } = useTranslation();

	const anyUnreadNotifications = notificationCenterMock.notifications.some(
		(notification) => notification.read === false
	);

	const rightNavItems: NavigationItem[] = useMemo(() => {
		return isLoggedIn
			? [
					// TODO: add notification center and user dropdown menu here
					{
						id: 'notification-center',
						node: (
							<Button
								onClick={() => setNotificationsOpen(!notificationsOpen)}
								variants="text"
								className={clsx(
									notificationsOpen ? 'u-color-teal' : 'u-color-white',
									`c-navigation__notifications-badge--${
										notificationsOpen ? 'white' : 'teal'
									}`,
									{
										['c-navigation__notifications-badge']:
											anyUnreadNotifications,
									}
								)}
								icon={<Icon type="solid" name="notification" />}
							/>
						),
					},
					{
						id: 'user-menu',
						node: user && <span>{`${user.firstName} ${user.lastName}`}</span>,
					},
			  ]
			: [
					{
						id: 'auth-button',
						node: (
							<Button
								label={t(
									'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
								)}
								variants={['white', 'text']}
								onClick={() => dispatch(setShowAuthModal(true))}
							/>
						),
					},
			  ];
	}, [dispatch, isLoggedIn, t, user, notificationsOpen, anyUnreadNotifications]);

	return (
		<div className="l-app">
			<Navigation>
				<Navigation.Left
					placement="left"
					renderHamburger={true}
					items={MOCK_ITEMS_LEFT}
					hamburgerProps={NAV_HAMBURGER_PROPS()}
				/>
				<Navigation.Right placement="right" items={rightNavItems} />
			</Navigation>

			<main className="l-app__main">
				<>
					{children}
					<NotificationCenter
						{...notificationCenterMock}
						isOpen={notificationsOpen}
						onClose={() => setNotificationsOpen(false)}
					/>
				</>
			</main>
			<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
		</div>
	);
};

export default AppLayout;
