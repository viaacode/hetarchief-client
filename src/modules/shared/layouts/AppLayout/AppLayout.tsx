import clsx from 'clsx';
import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';

import { AuthService } from '@auth/services/auth-service';
import { checkLoginAction, selectIsLoggedIn, selectUser } from '@auth/store/user';
import { Footer, Navigation, NavigationItem } from '@navigation/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@navigation/components/Footer/__mocks__/footer';
import { MOCK_ITEMS_LEFT } from '@navigation/components/Navigation/__mocks__/navigation';
import { NAV_HAMBURGER_PROPS, NAV_ITEMS_RIGHT, NAV_ITEMS_RIGHT_LOGGED_IN } from '@navigation/const';
import { NotificationCenter } from '@shared/components';
import { useGetNotifications } from '@shared/components/NotificationCenter/hooks/get-notifications';
import { useMarkAllNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-all-notifications-as-read';
import { useMarkOneNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-one-notifications-as-read';
import { NotificationStatus } from '@shared/services/notifications-service/notifications.types';
import { useAppDispatch } from '@shared/store';
import { getTosAction } from '@shared/store/tos/tos.slice';
import {
	selectIsStickyLayout,
	selectShowFooter,
	selectShowNavigationBorder,
	setShowAuthModal,
} from '@shared/store/ui/';

const AppLayout: FC = ({ children }) => {
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const dispatch = useAppDispatch();
	const { asPath } = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const sticky = useSelector(selectIsStickyLayout);
	const showFooter = useSelector(selectShowFooter);

	const showBorder = useSelector(selectShowNavigationBorder);

	useEffect(() => {
		dispatch(checkLoginAction());
		dispatch(getTosAction());
	}, [dispatch]);

	const { data: notificationResponse } = useGetNotifications();
	const anyUnreadNotifications =
		notificationResponse?.pages?.[0]?.items?.[0]?.status === NotificationStatus.UNREAD;
	const userName = (user?.firstName as string) ?? '';

	const onLoginRegisterClick = useCallback(() => dispatch(setShowAuthModal(true)), [dispatch]);

	const onLogOutClick = useCallback(() => AuthService.logout(), []);

	const rightNavItems: NavigationItem[] = useMemo(() => {
		return isLoggedIn
			? NAV_ITEMS_RIGHT_LOGGED_IN({
					anyUnreadNotifications,
					notificationsOpen,
					userName,
					onLogOutClick,
					setNotificationsOpen,
			  })
			: i18n
			? NAV_ITEMS_RIGHT(onLoginRegisterClick)
			: [];
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
			<Navigation showBorder={showBorder}>
				<Navigation.Left
					currentPath={asPath}
					hamburgerProps={
						i18n ? NAV_HAMBURGER_PROPS() : { openLabel: '', closedLabel: '' }
					}
					items={MOCK_ITEMS_LEFT}
					placement="left"
					renderHamburger={true}
					onOpenDropdowns={onOpenNavDropdowns}
				/>
				<Navigation.Right
					currentPath={asPath}
					placement="right"
					items={rightNavItems}
					onOpenDropdowns={onOpenNavDropdowns}
				/>
			</Navigation>

			<main className="l-app__main">
				{children}

				<NotificationCenter
					isOpen={notificationsOpen}
					onClose={() => setNotificationsOpen(false)}
					useGetNotificationsHook={useGetNotifications}
					useMarkOneNotificationsAsReadHook={useMarkOneNotificationsAsRead}
					useMarkAllNotificationsAsReadHook={useMarkAllNotificationsAsRead}
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

			{showFooter && (
				<Footer leftItem={footerLeftItem} links={footerLinks} rightItem={footerRightItem} />
			)}
		</div>
	);
};

export default AppLayout;
