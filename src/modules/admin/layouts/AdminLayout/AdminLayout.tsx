import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ListNavigationItem } from '@shared/components';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';

import { ADMIN_NAVIGATION_LINKS } from '../../const';

import { AdminLayoutProps } from './AdminLayout.types';

const AdminLayout: FC<AdminLayoutProps> = ({ children, className, contentTitle }) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();

	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			ADMIN_NAVIGATION_LINKS().map(({ id, label, href, children }) => ({
				id,
				node: ({ linkClassName }) => (
					<Link href={href}>
						<a className={linkClassName} title={label}>
							{label}
						</a>
					</Link>
				),
				active: href ? asPath.includes(href) : false,
				children: children?.().map(({ id, label, href }) => ({
					id,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a className={linkClassName} title={label}>
								{label}
							</a>
						</Link>
					),
					active: href ? asPath.includes(href) : false,
				})),
			})),
		[asPath]
	);

	const { t } = useTranslation();

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	return (
		<SidebarLayout
			className={className}
			contentTitle={contentTitle}
			sidebarLinks={sidebarLinks}
			sidebarTitle={t('modules/admin/layouts/admin-layout/admin-layout___admin')}
		>
			{children}
		</SidebarLayout>
	);
};

export default AdminLayout;
