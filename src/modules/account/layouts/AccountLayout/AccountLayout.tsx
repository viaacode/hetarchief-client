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
import { type FC, useCallback } from 'react';

import styles from './AccountLayout.module.scss';

const AccountLayout: FC<AccountLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const locale = useLocale();
	const { data: unreadSummary } = useGetMaterialRequestsUnreadSummary();
	const showMaterialRequestIndicator = useCallback(
		(id: string, hasChildren: boolean) =>
			showMaterialRequestUnreadIndicator(id, hasChildren, unreadSummary),
		[unreadSummary]
	);

	const shouldBeActive = useCallback((currentPath: string, parentPath: string) => {
		if (!parentPath) {
			return false;
		}
		const basePath = currentPath.split('?')[0].split('#')[0];
		return basePath === parentPath || currentPath.startsWith(`${parentPath}/`);
	}, []);

	const sidebarLinks: ListNavigationItem[] = GET_ACCOUNT_NAVIGATION_LINKS(locale).map(
		({ id, label, href, children }) => {
			const showIndicator = showMaterialRequestIndicator(id, !!children?.length);
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
					const showIndicator = showMaterialRequestIndicator(id, false);
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
		}
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
