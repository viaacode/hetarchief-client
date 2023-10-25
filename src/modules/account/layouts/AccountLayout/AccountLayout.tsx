import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { ListNavigationItem } from '@shared/components';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';

import styles from './AccountLayout.module.scss';
import { AccountLayoutProps } from './AccountLayout.types';

import { ACCOUNT_NAVIGATION_LINKS, Permission } from 'modules/account/const';

const AccountLayout: FC<AccountLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const hasAccountHistoryPerm = useHasAnyPermission(
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS
	);
	const hasPerm = useHasAnyPermission(Permission.VIEW_OWN_MATERIAL_REQUESTS);
	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			ACCOUNT_NAVIGATION_LINKS()
				.filter((link) => {
					// ARC-1922/ARC-1927: If user has no READ_PERSONAL_APPROVED_VISIT_REQUESTS permission,
					// or VIEW_OWN_MATERIAL_REQUESTS,
					// do not show account-history navigation or account-material-requests navigation
					const hideAccountHistory =
						!hasAccountHistoryPerm && link.id == 'account-history';
					const hideMaterialRequests = !hasPerm && link.id == 'account-material-requests';

					if (hideAccountHistory || hideMaterialRequests) {
						return;
					} else {
						return link;
					}
				})
				.map(({ id, label, href }) => ({
					id,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a className={linkClassName} aria-label={label}>
								{label}
							</a>
						</Link>
					),
					active: asPath.includes(href),
				})),
		[asPath]
	);

	const { tHtml } = useTranslation();

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
