import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { CP_ADMIN_NAVIGATION_LINKS, CP_ADMIN_SEARCH_VISITOR_SPACE_KEY } from '@cp/const';
import type { CPAdminLayoutProps } from '@cp/layouts';
import { useGetMaterialRequestsUnreadSummary } from '@material-requests/hooks/get-material-requests-unread-summary';
import { showMaterialRequestUnreadIndicator } from '@material-requests/utils/show-material-request-unread-indicator';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { Icon } from '@shared/components/Icon';
import type { ListNavigationItem } from '@shared/components/ListNavigation';
import { UnreadMaterialRequestIndicatorRow } from '@shared/components/UnreadMaterialRequestIndicator';
import { globalLabelKeys } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';
import { SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import { isNil } from 'es-toolkit/compat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './CPAdminLayout.module.scss';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();
	const locale = useLocale();

	const user = useSelector(selectUser);
	const { data: unreadSummary } = useGetMaterialRequestsUnreadSummary();
	const showMaterialRequestIndicator = useCallback(
		(href: string, hasChildren: boolean) =>
			showMaterialRequestUnreadIndicator(href, hasChildren, unreadSummary, locale),
		[unreadSummary, locale]
	);

	const shouldBeActive = useCallback((currentPath: string, parentPath: string) => {
		if (!parentPath) {
			return false;
		}
		const basePath = currentPath.split('?')[0].split('#')[0];
		return basePath === parentPath || currentPath.startsWith(`${parentPath}/`);
	}, []);

	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			CP_ADMIN_NAVIGATION_LINKS(
				locale,
				user?.permissions || [],
				user?.visitorSpaceSlug,
				user?.groupName === GroupName.CP_ADMIN
			).map(({ id, label, href, iconName, children }) => {
				const url =
					id !== CP_ADMIN_SEARCH_VISITOR_SPACE_KEY
						? href
						: stringifyUrl({
								url: href,
								query: {
									[SearchFilterId.Maintainer]: user?.visitorSpaceSlug,
								},
							});

				const showIndicator = showMaterialRequestIndicator(href, !!children?.length);
				return {
					id,
					node: ({ linkClassName }) => (
						<Link href={url} className={linkClassName} aria-label={label}>
							{!isNil(iconName) && <Icon className="u-mr-4" name={iconName} aria-hidden />}
							{showIndicator ? (
								<UnreadMaterialRequestIndicatorRow>
									<span>{label}</span>
									{showIndicator}
								</UnreadMaterialRequestIndicatorRow>
							) : (
								<span>{label}</span>
							)}
						</Link>
					),
					active: shouldBeActive(asPath, url),
					children: children?.map(({ id, label, href }) => {
						const showIndicator = showMaterialRequestIndicator(href, false);
						return {
							id,
							node: ({ linkClassName }) => (
								<Link href={href} className={linkClassName} aria-label={label}>
									{!isNil(iconName) && <Icon className="u-mr-4" name={iconName} aria-hidden />}
									{showIndicator ? (
										<UnreadMaterialRequestIndicatorRow>
											<span>{label}</span>
											{showIndicator}
										</UnreadMaterialRequestIndicatorRow>
									) : (
										<span>{label}</span>
									)}
								</Link>
							),
							active: shouldBeActive(asPath, href),
						};
					}),
				};
			}),
		[
			asPath,
			locale,
			user?.visitorSpaceSlug,
			user?.permissions,
			user?.groupName,
			shouldBeActive,
			showMaterialRequestIndicator,
		]
	);

	useEffect(() => {
		dispatch(setShowZendesk(true));
	}, [dispatch]);

	return (
		<SidebarLayout
			className={className}
			sidebarLinks={sidebarLinks}
			sidebarTitle={tHtml('modules/cp/layouts/cp-admin-layout/cp-admin-layout___beheer')}
		>
			<ErrorBoundary>
				{pageTitle && (
					<header className={clsx(styles['c--cp-admin__header'], 'l-container')}>
						<h2 className={styles['c-cp-admin__page-title']}>
							<label htmlFor={globalLabelKeys.adminLayout.title}>{pageTitle}</label>
						</h2>
					</header>
				)}
				{children}
			</ErrorBoundary>
		</SidebarLayout>
	);
};

export default CPAdminLayout;
