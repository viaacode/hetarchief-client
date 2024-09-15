import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC } from 'react';

import { GET_ACCOUNT_NAVIGATION_LINKS } from '@account/const';
import { type AccountLayoutProps } from '@account/layouts';
import { type ListNavigationItem } from '@shared/components/ListNavigation';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';

import styles from './AccountLayout.module.scss';

const AccountLayout: FC<AccountLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const locale = useLocale();

	const sidebarLinks: ListNavigationItem[] = GET_ACCOUNT_NAVIGATION_LINKS(locale).map(
		({ id, label, href }) => ({
			id,
			node: ({ linkClassName }) => (
				<Link href={href} className={linkClassName} aria-label={label}>
					{label}
				</Link>
			),
			active: asPath.includes(href),
		})
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
