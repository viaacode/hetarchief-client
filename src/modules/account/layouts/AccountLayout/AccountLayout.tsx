import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { ListNavigationItem } from '@shared/components';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';

import { AccountLayoutProps } from './AccountLayout.types';

import { ACCOUNT_NAVIGATION_LINKS } from 'modules/account/const';

const AccountLayout: FC<AccountLayoutProps> = ({ children, className, contentTitle }) => {
	const { asPath } = useRouter();
	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			ACCOUNT_NAVIGATION_LINKS().map(({ id, label, href }) => ({
				id,
				node: ({ linkClassName }) => (
					<Link href={href}>
						<a className={linkClassName} title={label}>
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
			contentTitle={contentTitle}
			sidebarLinks={sidebarLinks}
			sidebarTitle={t('Account')}
		>
			{children}
		</SidebarLayout>
	);
};

export default AccountLayout;
