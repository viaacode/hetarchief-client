import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { ListNavigationItem } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';

import styles from './AccountLayout.module.scss';
import { AccountLayoutProps } from './AccountLayout.types';

import { ACCOUNT_NAVIGATION_LINKS } from 'modules/account/const';

const AccountLayout: FC<AccountLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			ACCOUNT_NAVIGATION_LINKS().map(({ id, label, href }) => ({
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

	const { t } = useTranslation();

	return (
		<SidebarLayout
			className={className}
			sidebarLinks={sidebarLinks}
			sidebarTitle={t('modules/account/layouts/account-layout/account-layout___account')}
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
