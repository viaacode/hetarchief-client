import { Alert } from '@meemoo/react-components';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import { BooleanParam, StringParam, useQueryParams } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { AuthModal } from '@auth/components';
import { AuthService } from '@auth/services/auth-service';
import { checkLoginAction, selectIsLoggedIn, selectUser } from '@auth/store/user';
import { useDismissMaintenanceAlert } from '@maintenance-alerts/hooks/dismiss-maintenance-alerts';
import { useGetActiveMaintenanceAlerts } from '@maintenance-alerts/hooks/get-maintenance-alerts';
import { useGetPendingMaterialRequests } from '@material-requests/hooks/get-pending-material-requests';
import { Footer, Navigation, NavigationItem } from '@navigation/components';
import { footerLinks } from '@navigation/components/Footer/__mocks__/footer';
import { getNavigationItemsLeft } from '@navigation/components/Navigation/Navigation.consts';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import { useGetNavigationItems } from '@navigation/components/Navigation/hooks/get-navigation-items';
import {
	GET_NAV_HAMBURGER_PROPS,
	GET_NAV_ITEMS_RIGHT,
	GET_NAV_ITEMS_RIGHT_LOGGED_IN,
} from '@navigation/const';
import { NavigationPlacement } from '@navigation/services/navigation-service';
import {
	AlertIconNames,
	HetArchiefLogo,
	HetArchiefLogoType,
	Icon,
	IconNamesLight,
	NotificationCenter,
	ZendeskWrapper,
} from '@shared/components';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import Html from '@shared/components/Html/Html';
import LanguageSwitcher from '@shared/components/LanguageSwitcher/LanguageSwitcher';
import { useGetNotifications } from '@shared/components/NotificationCenter/hooks/get-notifications';
import { useMarkAllNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-all-notifications-as-read';
import { useMarkOneNotificationsAsRead } from '@shared/components/NotificationCenter/hooks/mark-one-notifications-as-read';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useWindowSize } from '@shared/hooks/use-window-size';
import { NotificationsService } from '@shared/services/notifications-service/notifications.service';
import { useAppDispatch } from '@shared/store';
import { getTosAction } from '@shared/store/tos/tos.slice';
import {
	selectHasUnreadNotifications,
	selectIsStickyLayout,
	selectShowAuthModal,
	selectShowFooter,
	selectShowNavigationHeaderRight,
	selectShowNotificationsCenter,
	setHasUnreadNotifications,
	setMaterialRequestCount,
	setOpenNavigationDropdownId,
	setShowAuthModal,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui/';
import { Breakpoints, Visit } from '@shared/types';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { useGetAllActiveVisits } from '@visit-requests/hooks/get-all-active-visits';

import packageJson from '../../../../../package.json';

import styles from './AppLayout.module.scss';

// We want to make sure config gets fetched here, no sure why anymore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { publicRuntimeConfig } = getConfig();

const AppLayout: FC<any> = ({ children }) => {
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const router = useRouter();
	const locale = useLocale();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const user = useSelector(selectUser);
	const sticky = useSelector(selectIsStickyLayout);
	const showNavigationHeaderRight = useSelector(selectShowNavigationHeaderRight);
	const showFooter = useSelector(selectShowFooter);
	const showAuthModal = useSelector(selectShowAuthModal);
	const showNotificationsCenter = useSelector(selectShowNotificationsCenter);
	const hasUnreadNotifications = useSelector(selectHasUnreadNotifications);
	const windowSize = useWindowSize();
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.xxl);
	const canViewAllSpaces = useHasAllPermission(Permission.READ_ALL_SPACES);
	const { data: accessibleVisitorSpaces } = useGetAccessibleVisitorSpaces({
		canViewAllSpaces,
	});
	const { data: materialRequests } = useGetPendingMaterialRequests({}, { enabled: isKioskUser });
	const { data: navigationItems } = useGetNavigationItems(locale);
	const canManageAccount = useHasAllPermission(Permission.MANAGE_ACCOUNT);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const linkedSpaceSlug: string | null = user?.visitorSpaceSlug || null;
	const linkedSpaceOrId: string | null = user?.organisationId || null;
	const [query, setQuery] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
		[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: StringParam,
		[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});
	const { data: maintenanceAlerts } = useGetActiveMaintenanceAlerts(
		{},
		{ keepPreviousData: true, enabled: !isKioskUser }
	);
	const { mutateAsync: dismissMaintenanceAlert } = useDismissMaintenanceAlert();
	const isKioskOrAnonymous = useHasAnyGroup(GroupName.KIOSK_VISITOR, GroupName.ANONYMOUS);
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const { data: spaces } = useGetAllActiveVisits(
		{},
		{ keepPreviousData: true, enabled: isLoggedIn }
	);

	const [alertsIgnoreUntil, setAlertsIgnoreUntil] = useLocalStorage(
		'HET_ARCHIEF.alerts.ignoreUntil',
		'{}'
	);

	const [visitorSpaces, setVisitorSpaces] = useState<Visit[]>([]);

	useEffect(() => {
		if (showNotificationsCenter) {
			scrollTo(0, 'instant');
		}
	}, [showNotificationsCenter]);

	const setNotificationsOpen = useCallback(
		(show: boolean) => {
			show && scrollTo(0);
			dispatch(setShowMaterialRequestCenter(false));
			dispatch(setOpenNavigationDropdownId(null));
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

	const getVisitorSpaces = useCallback((): Visit[] => {
		if (!user || isKioskOrAnonymous) {
			setVisitorSpaces([]);
			return [];
		}

		spaces && setVisitorSpaces(spaces.items);

		return spaces?.items || [];
	}, [isKioskOrAnonymous, spaces, user]);

	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// ARC-2011: small timeout so login is not shown before user is checked
		// If this gives issues in the future, we might want to look into replacing this timeout with
		// selectHasCheckedLogin from the redux store
		setTimeout(() => {
			setIsLoaded(true);
		}, 300);
	}, []);

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
	}, [queryClient, router, user, setNotificationsOpen, setUnreadNotifications, locale]);

	useEffect(() => {
		dispatch(checkLoginAction());
		dispatch(getTosAction());
	}, [dispatch]);

	// Sync showAuth query param with store value
	useEffect(() => {
		if (user) {
			setQuery({
				...query,
				[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: undefined,
			});
			dispatch(setShowAuthModal(false));
		} else if (typeof query.showAuth === 'boolean') {
			dispatch(setShowAuthModal(query.showAuth));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, query.showAuth, user]);

	useEffect(() => {
		// Ward: on init set materialRequestCount in navigation
		materialRequests && dispatch(setMaterialRequestCount(materialRequests?.items.length));
	}, [dispatch, materialRequests]);

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		getVisitorSpaces();
	}, [getVisitorSpaces, isLoggedIn]);

	const userName = (user?.firstName as string) ?? '';

	const onLoginRegisterClick = useCallback(async () => {
		return router.replace(
			stringifyUrl({
				url: router.asPath,
				query: {
					[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: '1',
				},
			})
		);
	}, [router]);

	const onLogOutClick = useCallback(async () => await AuthService.logout(), []);

	const onCloseAuthModal = () => {
		if (typeof query[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY] === 'boolean') {
			setQuery({
				[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: undefined,
				[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: undefined,
			});
		}
		dispatch(setShowAuthModal(false));
	};

	const rightNavItems: NavigationItem[] = useMemo(() => {
		if (isLoggedIn) {
			if (!canManageAccount) {
				return [];
			}

			return GET_NAV_ITEMS_RIGHT_LOGGED_IN(
				router.asPath,
				navigationItems || {},
				accessibleVisitorSpaces || [],
				showLinkedSpaceAsHomepage ? linkedSpaceSlug : null,
				locale,
				{
					hasUnreadNotifications,
					notificationsOpen: showNotificationsCenter,
					userName,
					onLogOutClick,
					setNotificationsOpen,
				}
			);
		}

		return GET_NAV_ITEMS_RIGHT(onLoginRegisterClick);
	}, [
		isLoggedIn,
		onLoginRegisterClick,
		canManageAccount,
		router.asPath,
		navigationItems,
		accessibleVisitorSpaces,
		showLinkedSpaceAsHomepage,
		linkedSpaceSlug,
		locale,
		hasUnreadNotifications,
		showNotificationsCenter,
		userName,
		onLogOutClick,
		setNotificationsOpen,
	]);

	const leftNavItems: NavigationItem[] = useMemo(() => {
		const dynamicItems = getNavigationItemsLeft(
			router.asPath,
			accessibleVisitorSpaces || [],
			navigationItems || {},
			user?.permissions || [],
			showLinkedSpaceAsHomepage ? linkedSpaceOrId : null,
			isMobile,
			user?.visitorSpaceSlug || null,
			visitorSpaces,
			isMeemooAdmin,
			locale
		);

		const staticItems = [
			{
				// Hard reload the page when going to the homepage because of nextjs issues with the static 404 page not loading env variables
				// Otherwise you get an infinite loading state because no api calls will work
				// https://github.com/vercel/next.js/issues/37005
				node: (
					<div
						onClick={() => {
							window.open(window.location.origin, '_self');
						}}
					>
						<HetArchiefLogo
							className="c-navigation__logo c-navigation__logo--list"
							type={isMobile ? HetArchiefLogoType.Dark : HetArchiefLogoType.Light}
						/>
					</div>
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
		router.asPath,
		accessibleVisitorSpaces,
		navigationItems,
		user?.permissions,
		user?.visitorSpaceSlug,
		showLinkedSpaceAsHomepage,
		linkedSpaceOrId,
		isMobile,
		visitorSpaces,
		isMeemooAdmin,
		locale,
		isLoggedIn,
	]);

	const showLoggedOutGrid = useMemo(() => !isLoggedIn && isMobile, [isMobile, isLoggedIn]);

	const onOpenNavDropdowns = () => {
		// Also close notification center when opening other dropdowns in nav
		if (showNotificationsCenter) {
			setNotificationsOpen(false);
		}
	};

	const onCloseAlert = async (alertId: string | undefined) => {
		if (!alertId) {
			return;
		}

		const alert = maintenanceAlerts?.items.find((alert) => alert.id === alertId);

		// Store the dismissal in local storage, so this alert isn't shown anymore
		const newAlertsIgnoreUntil = JSON.stringify({
			...JSON.parse(alertsIgnoreUntil),
			[alertId]: alert?.untilDate,
		});

		if (isLoggedIn) {
			// Add the alert to the users read notifications
			await dismissMaintenanceAlert(alertId);
		}

		setAlertsIgnoreUntil(newAlertsIgnoreUntil);
	};

	const activeAlerts = useMemo(() => {
		return maintenanceAlerts?.items.filter(
			(item) => JSON.parse(alertsIgnoreUntil)[item.id] !== item.untilDate
		);
	}, [maintenanceAlerts?.items, alertsIgnoreUntil]);

	const renderAlerts = () => {
		return (
			<div className="l-app__alerts-overlay l-container">
				{activeAlerts?.map((alert) => {
					return (
						<Alert
							id={alert.id}
							key={alert.id}
							title={alert.title}
							content={<Html content={alert.message} type="div" />}
							variants="blue"
							icon={
								<Icon
									name={IconNamesLight[alert.type as keyof typeof AlertIconNames]}
								/>
							}
							closeIcon={<Icon name={IconNamesLight.Times} />}
							onClose={onCloseAlert}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<div
			className={clsx(styles['l-app'], {
				'l-app--sticky': sticky,
			})}
		>
			<Navigation loggedOutGrid={showLoggedOutGrid}>
				{!isLoggedIn && isMobile && (
					<div
						className="c-navigation__logo--hamburger"
						onClick={() => {
							window.open(window.location.origin, '_self');
						}}
					>
						{/* Hard reload the page when going to the homepage because of nextjs issues with the static 404 page not loading env variables */}
						{/* https://github.com/vercel/next.js/issues/37005 */}
						<HetArchiefLogo type={HetArchiefLogoType.Light} />
					</div>
				)}
				<Navigation.Left
					currentPath={router.asPath}
					hamburgerProps={GET_NAV_HAMBURGER_PROPS()}
					items={leftNavItems}
					placement="left"
					renderHamburger={showNavigationHeaderRight && isMobile}
					onOpenDropdowns={onOpenNavDropdowns}
				/>
				{isLoaded && showNavigationHeaderRight && (
					<div className={styles['c-navigation__section--right']}>
						<LanguageSwitcher />
						<Navigation.Right
							currentPath={router.asPath}
							placement="right"
							items={rightNavItems}
							onOpenDropdowns={onOpenNavDropdowns}
						/>
					</div>
				)}
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
				{renderAlerts()}
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
					linkSections={[
						footerLinks(navigationItems?.[NavigationPlacement.FooterSection1] || []),
						footerLinks(navigationItems?.[NavigationPlacement.FooterSection2] || []),
						footerLinks(navigationItems?.[NavigationPlacement.FooterSection3] || []),
					]}
				/>
			)}
		</div>
	);
};

export default AppLayout;
