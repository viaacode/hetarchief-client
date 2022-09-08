import { useSlot } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
	AdminActions,
	AdminContent,
	AdminFiltersLeft,
	AdminFiltersRight,
} from '@admin/layouts/AdminLayout/AdminLayout.slots';
import { ListNavigationItem } from '@shared/components';
import { globalLabelKeys } from '@shared/const';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';

import { ADMIN_NAVIGATION_LINKS } from '../../const';

import styles from './AdminLayout.module.scss';
import { AdminLayoutComponent } from './AdminLayout.types';

const AdminLayout: AdminLayoutComponent = ({ children, pageTitle, className }) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const actions = useSlot(AdminActions, children);
	const filtersLeft = useSlot(AdminFiltersLeft, children);
	const filtersRight = useSlot(AdminFiltersRight, children);
	const content = useSlot(AdminContent, children);

	useHideFooter();

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	const shouldBeActive = (currentPath: string, parentPath: string) => {
		if (!parentPath) {
			return false;
		}
		const basePath = currentPath.split('?')[0].split('#')[0];
		return basePath === parentPath || currentPath.startsWith(parentPath + '/');
	};

	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			ADMIN_NAVIGATION_LINKS().map(({ id, label, href, children }) => ({
				id,
				node: ({ linkClassName }) => (
					<Link href={href}>
						<a className={linkClassName} aria-label={label}>
							{label}
						</a>
					</Link>
				),
				active: shouldBeActive(asPath, href),
				children: children?.().map(({ id, label, href }) => ({
					id,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a className={linkClassName} aria-label={label}>
								{label}
							</a>
						</Link>
					),
					active: shouldBeActive(asPath, href),
				})),
			})),
		[asPath]
	);

	return (
		<SidebarLayout
			className={className}
			sidebarLinks={sidebarLinks}
			sidebarTitle={t('modules/admin/layouts/admin-layout/admin-layout___admin')}
		>
			{(!!pageTitle || !!actions) && (
				<header className={clsx(styles['c-admin__header'], 'l-container')}>
					<h2 className={styles['c-admin__page-title']}>
						<label htmlFor={globalLabelKeys.adminLayout.title}>{pageTitle}</label>
					</h2>
					<div className={styles['c-admin__actions']}>{actions}</div>
				</header>
			)}

			<div className="c-admin__filter-bar">
				<div className="c-admin__filter-bar-left">{filtersLeft}</div>
				<div className="c-admin__filter-bar-right">{filtersRight}</div>
			</div>

			<div className="c-admin__content">{content}</div>
		</SidebarLayout>
	);
};

AdminLayout.Actions = AdminActions;
AdminLayout.FiltersLeft = AdminFiltersLeft;
AdminLayout.FiltersRight = AdminFiltersRight;
AdminLayout.Content = AdminContent;

export default AdminLayout;
