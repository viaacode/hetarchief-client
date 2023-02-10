import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';

import { Permission } from '@account/const';
import { AuthService } from '@auth/services/auth-service';
import { checkLoginAction, selectIsLoggedIn, selectUser } from '@auth/store/user';
import { Footer, Navigation, NavigationItem } from '@navigation/components';
import {
	footerLeftItem,
	footerLinks,
	footerRightItem,
} from '@navigation/components/Footer/__mocks__/footer';
import { getNavigationItemsLeft } from '@navigation/components/Navigation/Navigation.consts';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import { useGetNavigationItems } from '@navigation/components/Navigation/hooks/get-navigation-items';
import { NAV_HAMBURGER_PROPS, NAV_ITEMS_RIGHT, NAV_ITEMS_RIGHT_LOGGED_IN } from '@navigation/const';
import { NavigationPlacement } from '@navigation/services/navigation-service';
import { Logo, LogoType, NotificationCenter, ZendeskWrapper } from '@shared/components';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { useGetNotifications } from '@shared/components/NotificationCenter/hooks/get-notifications';
import { useMarkAllNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-all-notifications-as-read';
import { useMarkOneNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-one-notifications-as-read';
import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useHistory } from '@shared/hooks/use-history';
import { useWindowSize } from '@shared/hooks/use-window-size';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { useAppDispatch } from '@shared/store';
import { selectHistory } from '@shared/store/history';
import { getTosAction } from '@shared/store/tos/tos.slice';
import {
	selectHasUnreadNotifications,
	selectIsStickyLayout,
	selectShowFooter,
	selectShowNavigationBorder,
	selectShowNotificationsCenter,
	setHasUnreadNotifications,
	setShowAuthModal,
	setShowNotificationsCenter,
} from '@shared/store/ui/';
import { Breakpoints } from '@shared/types';
import { scrollTo } from '@shared/utils/scroll-to-top';

import packageJson from '../../../../../package.json';

const AppLayout: FC = ({ children }) => {
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const router = useRouter();
	const { asPath } = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const sticky = useSelector(selectIsStickyLayout);
	const showFooter = useSelector(selectShowFooter);
	const showNotificationsCenter = useSelector(selectShowNotificationsCenter);
	const hasUnreadNotifications = useSelector(selectHasUnreadNotifications);
	const windowSize = useWindowSize();
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const showBorder = useSelector(selectShowNavigationBorder);
	const { data: accessibleVisitorSpaces } = useGetAccessibleVisitorSpaces();
	const history = useSelector(selectHistory);
	const { data: navigationItems } = useGetNavigationItems();
	const canManageAccount = useHasAllPermission(Permission.MANAGE_ACCOUNT);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const linkedSpaceSlug: string | null = user?.visitorSpaceSlug || null;

	useHistory(asPath, history);

	const setNotificationsOpen = useCallback(
		(show: boolean) => {
			show && scrollTo(0);
			dispatch(setShowNotificationsCenter(show));
		},
		[dispatch]
	);

	const setUnreadNotifications = useCallback(
		(hasUnreadNotifications: boolean) => {
			dispatch(setHasUnreadNotifications(hasUnreadNotifications));
		},
		[dispatch]
	);

	useEffect(() => {
		// Set the build version on the window object
		(window as unknown as Record<string, unknown>).HETARCHIEF_VERSION = packageJson.version;
	}, []);

	useEffect(() => {
		if (router && user) {
			NotificationsService.setQueryClient(queryClient);
			NotificationsService.initPolling(router, setNotificationsOpen, setUnreadNotifications);
		} else {
			NotificationsService.stopPolling();
		}
	}, [queryClient, router, user, setNotificationsOpen, setUnreadNotifications]);

	useEffect(() => {
		dispatch(checkLoginAction());
		dispatch(getTosAction());
	}, [dispatch]);

	const userName = (user?.firstName as string) ?? '';

	const onLoginRegisterClick = useCallback(() => dispatch(setShowAuthModal(true)), [dispatch]);

	const onLogOutClick = useCallback(() => AuthService.logout(), []);

	const rightNavItems: NavigationItem[] = useMemo(() => {
		if (isLoggedIn) {
			if (!canManageAccount) {
				return [];
			}

			return NAV_ITEMS_RIGHT_LOGGED_IN(asPath, navigationItems || {}, {
				hasUnreadNotifications,
				notificationsOpen: showNotificationsCenter,
				userName,
				onLogOutClick,
				setNotificationsOpen,
			});
		}

		return NAV_ITEMS_RIGHT(onLoginRegisterClick);
	}, [
		asPath,
		canManageAccount,
		hasUnreadNotifications,
		isLoggedIn,
		navigationItems,
		onLoginRegisterClick,
		onLogOutClick,
		setNotificationsOpen,
		showNotificationsCenter,
		userName,
	]);

	const leftNavItems: NavigationItem[] = useMemo(() => {
		const dynamicItems = getNavigationItemsLeft(
			asPath,
			accessibleVisitorSpaces || [],
			navigationItems || {},
			user?.permissions || [],
			showLinkedSpaceAsHomepage ? linkedSpaceSlug : null,
			isMobile
		);

		const staticItems = [
			{
				node: (
					<Logo
						className="c-navigation__logo c-navigation__logo--list"
						type={isMobile ? LogoType.Dark : LogoType.Light}
					/>
				),
				id: 'logo',
				activeDesktop: false,
				activeMobile: false,
				isDivider: false,
			},
		];

		if (!isLoggedIn && isMobile) {
			return dynamicItems;
		}

		return [...staticItems, ...dynamicItems];
	}, [
		accessibleVisitorSpaces,
		asPath,
		isMobile,
		linkedSpaceSlug,
		navigationItems,
		showLinkedSpaceAsHomepage,
		user?.permissions,
		isLoggedIn,
	]);

	const showLoggedOutGrid = useMemo(() => !isLoggedIn && isMobile, [isMobile, isLoggedIn]);

	const onOpenNavDropdowns = () => {
		// Also close notification center when opening other dropdowns in nav
		if (showNotificationsCenter) {
			setNotificationsOpen(false);
		}
	};

	return (
		<div
			className={clsx('l-app', {
				'l-app--sticky': sticky,
			})}
		>
			<Navigation showBorder={showBorder} loggedOutGrid={showLoggedOutGrid}>
				{!isLoggedIn && isMobile && (
					<div className="c-navigation__logo--hamburger">
						<Logo type={LogoType.Light} />
					</div>
				)}
				<Navigation.Left
					currentPath={asPath}
					hamburgerProps={NAV_HAMBURGER_PROPS()}
					items={leftNavItems}
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
				<WindowSizeContext.Provider value={windowSize}>
					<ErrorBoundary>{children}</ErrorBoundary>
				</WindowSizeContext.Provider>
				<NotificationCenter
					isOpen={showNotificationsCenter}
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

			<ZendeskWrapper />

			{showFooter && (
				<Footer
					leftItem={footerLeftItem}
					links={footerLinks(navigationItems?.[NavigationPlacement.FooterCenter] || [])}
					rightItem={footerRightItem}
				/>
			)}
		</div>
	);
};

export default AppLayout;
