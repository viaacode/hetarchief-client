import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import { BooleanParam } from 'serialize-query-params/lib/params';
import { StringParam, useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { AuthModal } from '@auth/components';
import { AuthService } from '@auth/services/auth-service';
import { checkLoginAction, selectIsLoggedIn, selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY, VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
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
import {
	HetArchiefLogo,
	HetArchiefLogoType,
	NotificationCenter,
	ZendeskWrapper,
} from '@shared/components';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { useGetNotifications } from '@shared/components/NotificationCenter/hooks/get-notifications';
import { useMarkAllNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-all-notifications-as-read';
import { useMarkOneNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-one-notifications-as-read';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
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
	selectShowAuthModal,
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
	const showAuthModal = useSelector(selectShowAuthModal);
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
	const linkedSpaceOrId: string | null = user?.maintainerId || null;
	const [query, setQuery] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
		[SEARCH_QUERY_KEY]: StringParam,
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

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

	// Sync showAuth query param with store value
	useEffect(() => {
		if (user) {
			setQuery({
				...query,
				[SHOW_AUTH_QUERY_KEY]: undefined,
			});
			dispatch(setShowAuthModal(false));
		} else if (typeof query.showAuth === 'boolean') {
			dispatch(setShowAuthModal(query.showAuth));
		}
	}, [dispatch, query.showAuth, user]);

	const userName = (user?.firstName as string) ?? '';

	const onLoginRegisterClick = useCallback(() => dispatch(setShowAuthModal(true)), [dispatch]);

	const onLogOutClick = useCallback(() => AuthService.logout(), []);

	const onCloseAuthModal = () => {
		if (typeof query[SHOW_AUTH_QUERY_KEY] === 'boolean') {
			setQuery({
				[SHOW_AUTH_QUERY_KEY]: undefined,
				[VISITOR_SPACE_SLUG_QUERY_KEY]: undefined,
			});
		}
		dispatch(setShowAuthModal(false));
	};

	const rightNavItems: NavigationItem[] = useMemo(() => {
		if (isLoggedIn) {
			if (!canManageAccount) {
				return [];
			}

			return NAV_ITEMS_RIGHT_LOGGED_IN(
				asPath,
				navigationItems || {},
				accessibleVisitorSpaces || [],
				showLinkedSpaceAsHomepage ? linkedSpaceSlug : null,
				{
					hasUnreadNotifications,
					notificationsOpen: showNotificationsCenter,
					userName,
					onLogOutClick,
					setNotificationsOpen,
				}
			);
		}

		return NAV_ITEMS_RIGHT(onLoginRegisterClick);
	}, [
		onLoginRegisterClick,
		isLoggedIn,
		canManageAccount,
		asPath,
		navigationItems,
		accessibleVisitorSpaces,
		showLinkedSpaceAsHomepage,
		linkedSpaceSlug,
		hasUnreadNotifications,
		showNotificationsCenter,
		userName,
		onLogOutClick,
		setNotificationsOpen,
	]);

	const leftNavItems: NavigationItem[] = useMemo(() => {
		const dynamicItems = getNavigationItemsLeft(
			asPath,
			accessibleVisitorSpaces || [],
			navigationItems || {},
			user?.permissions || [],
			showLinkedSpaceAsHomepage ? linkedSpaceOrId : null,
			isMobile
		);

		const staticItems = [
			{
				node: (
					<Link href={ROUTES.home}>
						<a tabIndex={0}>
							<HetArchiefLogo
								className="c-navigation__logo c-navigation__logo--list"
								type={isMobile ? HetArchiefLogoType.Dark : HetArchiefLogoType.Light}
							/>
						</a>
					</Link>
				),
				id: 'logo',
				path: '/',
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
						<Link href={ROUTES.home}>
							<a tabIndex={0}>
								<HetArchiefLogo type={HetArchiefLogoType.Light} />
							</a>
						</Link>
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

			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />

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
