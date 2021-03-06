import clsx from 'clsx';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
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
import { NotificationCenter, ZendeskWrapper } from '@shared/components';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { useGetNotifications } from '@shared/components/NotificationCenter/hooks/get-notifications';
import { useMarkAllNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-all-notifications-as-read';
import { useMarkOneNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-one-notifications-as-read';
import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { i18n } from '@shared/helpers/i18n';
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

const { publicRuntimeConfig } = getConfig();

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
			return NAV_ITEMS_RIGHT_LOGGED_IN({
				hasUnreadNotifications,
				notificationsOpen: showNotificationsCenter,
				userName,
				onLogOutClick,
				setNotificationsOpen,
			});
		}
		return NAV_ITEMS_RIGHT(onLoginRegisterClick);
	}, [
		hasUnreadNotifications,
		isLoggedIn,
		userName,
		showNotificationsCenter,
		onLoginRegisterClick,
		onLogOutClick,
		setNotificationsOpen,
		canManageAccount,
	]);

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
			{/* <!-- start Flowplayer imports --> */}
			{/* Importing these in the root of the app so they are loaded when the flowplayer component starts to initialise */}
			<Script strategy="beforeInteractive" src="/flowplayer/flowplayer.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/speed.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/subtitles.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/hls.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/cuepoints.min.js" />
			<Script
				strategy="beforeInteractive"
				src="/flowplayer/plugins/google-analytics.min.js"
			/>
			{/* <!-- end Flowplayer imports --> */}

			<Navigation showBorder={showBorder}>
				<Navigation.Left
					currentPath={asPath}
					hamburgerProps={
						i18n ? NAV_HAMBURGER_PROPS() : { openLabel: '', closedLabel: '' }
					}
					items={getNavigationItemsLeft(
						asPath,
						accessibleVisitorSpaces || [],
						navigationItems?.[NavigationPlacement.HeaderLeft] || [],
						user?.permissions || [],
						showLinkedSpaceAsHomepage ? linkedSpaceSlug : null,
						isMobile
					)}
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
