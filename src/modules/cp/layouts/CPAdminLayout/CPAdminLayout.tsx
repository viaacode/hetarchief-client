import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { ListNavigation, ListNavigationItem, Sidebar } from '@shared/components';

import { CP_ADMIN_NAVIGATION_LINKS } from '../../const';

import { CPAdminLayoutProps } from './CPAdminLayout.types';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ pageTitle }) => {
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
		<div>
			<Sidebar title={t('Beheer')}>
				<ListNavigation listItems={sidebarLinks} />
			</Sidebar>
			<div>
				<h1>{pageTitle}</h1>
			</div>
		</div>
	);
};

export default CPAdminLayout;
