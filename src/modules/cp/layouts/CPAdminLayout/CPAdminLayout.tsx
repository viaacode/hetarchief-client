import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { CP_ADMIN_NAVIGATION_LINKS } from '@cp/const';
import { ListNavigationItem } from '@shared/components';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';

import { CPAdminLayoutProps } from './CPAdminLayout.types';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ children, className, contentTitle }) => {
	const { asPath } = useRouter();
	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			CP_ADMIN_NAVIGATION_LINKS().map(({ id, label, href }) => ({
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
			sidebarTitle={t('modules/cp/layouts/cp-admin-layout/cp-admin-layout___beheer')}
		>
			{children}
		</SidebarLayout>
	);
};

export default CPAdminLayout;
