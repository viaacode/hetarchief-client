import clsx from 'clsx';
import { useRouter } from 'next/router';
import { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';

import { selectIsLoggedIn, selectUser, setMockUser } from '@auth/store/user';
import { Footer, Navigation, NavigationItem } from '@navigation/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@navigation/components/Footer/__mocks__/footer';
import { MOCK_ITEMS_LEFT } from '@navigation/components/Navigation/__mocks__/navigation';
import { NAV_HAMBURGER_PROPS, NAV_ITEMS_RIGHT, NAV_ITEMS_RIGHT_LOGGED_IN } from '@navigation/const';
import { Notification, NotificationCenter, notificationCenterMock } from '@shared/components';
import { selectIsStickyLayout, setShowAuthModal } from '@shared/store/ui';

const AppLayout: FC = ({ children }) => {
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const dispatch = useDispatch();
	const { asPath } = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const sticky = useSelector(selectIsStickyLayout);

	const anyUnreadNotifications = notificationCenterMock.notifications.some(
		(notification: Notification) => notification.read === false
	);
	const userName = (user?.firstName as string) ?? '';

	const onLoginRegisterClick = useCallback(() => dispatch(setShowAuthModal(true)), [dispatch]);
	const onLogOutClick = useCallback(() => dispatch(setMockUser(null)), [dispatch]);

	const rightNavItems: NavigationItem[] = useMemo(() => {
		return isLoggedIn
			? NAV_ITEMS_RIGHT_LOGGED_IN({
					anyUnreadNotifications,
					notificationsOpen,
					userName,
					onLogOutClick,
					setNotificationsOpen,
			  })
			: NAV_ITEMS_RIGHT(onLoginRegisterClick);
	}, [
		anyUnreadNotifications,
		isLoggedIn,
		userName,
		notificationsOpen,
		onLoginRegisterClick,
		onLogOutClick,
	]);

	const onOpenNavDropdowns = () => {
		// Also close notification center when opening other dropdowns in nav
		if (notificationsOpen) {
			setNotificationsOpen(false);
		}
	};

	return (
		<div
			className={clsx('l-app', {
				'l-app--sticky': sticky,
			})}
		>
			<Navigation>
				<Navigation.Left
					currentPath={asPath}
					hamburgerProps={NAV_HAMBURGER_PROPS()}
					items={MOCK_ITEMS_LEFT}
					placement="left"
					renderHamburger={true}
					onOpenDropdowns={onOpenNavDropdowns}
				/>
				<Navigation.Right
					placement="right"
					items={rightNavItems}
					onOpenDropdowns={onOpenNavDropdowns}
				/>
			</Navigation>

			<main className="l-app__main">
				{children}

				<NotificationCenter
					{...notificationCenterMock}
					isOpen={notificationsOpen}
					onClose={() => setNotificationsOpen(false)}
				/>
			</main>

			<ToastContainer
				autoClose={5000}
				className="c-toast-container"
				toastClassName="c-toast-container__toast"
				closeButton={false}
				hideProgressBar
				position="bottom-left"
				transition={Slide}
			/>

			<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
		</div>
	);
};

export default AppLayout;
