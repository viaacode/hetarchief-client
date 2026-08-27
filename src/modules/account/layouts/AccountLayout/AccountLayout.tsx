import { GET_ACCOUNT_NAVIGATION_LINKS } from '@account/const';
import type { AccountLayoutProps } from '@account/layouts';
import { useGetMaterialRequestsUnreadSummary } from '@material-requests/hooks/get-material-requests-unread-summary';
import { showMaterialRequestUnreadIndicator } from '@material-requests/utils/show-material-request-unread-indicator';
import type { ListNavigationItem } from '@shared/components/ListNavigation';
import { UnreadMaterialRequestIndicatorRow } from '@shared/components/UnreadMaterialRequestIndicator';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC, useCallback, useMemo } from 'react';

import styles from './AccountLayout.module.scss';

const AccountLayout: FC<AccountLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const locale = useLocale();
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

	// GET_ACCOUNT_NAVIGATION_LINKS calls hooks internally (useHasAnyPermission/useHasAnyGroup),
	// so it must be called directly in the component body, not inside useMemo's factory.
	const accountNavigationLinks = GET_ACCOUNT_NAVIGATION_LINKS(locale);
	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			accountNavigationLinks.map(({ id, label, href, children }) => {
				const showIndicator = showMaterialRequestIndicator(href, !!children?.length);
				return {
					id,
					node: ({ linkClassName }) => (
						<Link href={href} className={linkClassName} aria-label={label}>
							{showIndicator ? (
								<UnreadMaterialRequestIndicatorRow>{label}</UnreadMaterialRequestIndicatorRow>
							) : (
								label
							)}
						</Link>
					),
					active: shouldBeActive(asPath, href),
					children: children?.map(({ id, label, href }) => {
						const showIndicator = showMaterialRequestIndicator(href, false);
						return {
							id,
							node: ({ linkClassName }) => (
								<Link href={href} className={linkClassName} aria-label={label}>
									{showIndicator ? (
										<UnreadMaterialRequestIndicatorRow>{label}</UnreadMaterialRequestIndicatorRow>
									) : (
										label
									)}
								</Link>
							),
							active: shouldBeActive(asPath, href),
						};
					}),
				};
			}),
		[accountNavigationLinks, asPath, shouldBeActive, showMaterialRequestIndicator]
	);

	return (
		<SidebarLayout
			className={className}
			sidebarLinks={sidebarLinks}
			sidebarTitle={tHtml('modules/account/layouts/account-layout/account-layout___account')}
		>
			{pageTitle && (
				<header className={clsx(styles['c--account-admin__header'], 'l-container')}>
					<h2 className={styles['c-account-admin__page-title']}>{pageTitle}</h2>
				</header>
			)}
			{children}
		</SidebarLayout>
	);
};

export default AccountLayout;
