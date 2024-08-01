import { useSlot } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ADMIN_NAVIGATION_LINKS } from '@admin/const/Routing.const';
import { type AdminLayoutComponent } from '@admin/layouts';
import {
	AdminActions,
	AdminContent,
	AdminFiltersLeft,
	AdminFiltersRight,
} from '@admin/layouts/AdminLayout/AdminLayout.slots';
import { type ListNavigationItem } from '@shared/components/ListNavigation';
import { globalLabelKeys } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';

import styles from './AdminLayout.module.scss';

const AdminLayout: AdminLayoutComponent = ({
	children,
	pageTitle,
	className,
	bottomPadding = true,
}) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();
	const locale = useLocale();

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
			ADMIN_NAVIGATION_LINKS(locale).map(({ id, label, href, children }) => ({
				id,
				node: ({ linkClassName }) => (
					<Link href={href}>
						<a className={linkClassName} aria-label={label}>
							{label}
						</a>
					</Link>
				),
				active: shouldBeActive(asPath, href),
				children: children?.(locale).map(({ id, label, href }) => ({
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
		[asPath, locale]
	);

	return (
		<SidebarLayout
			className={className}
			sidebarLinks={sidebarLinks}
			sidebarTitle={tHtml('modules/admin/layouts/admin-layout/admin-layout___admin')}
		>
			{(!!pageTitle || !!actions) && (
				<header className={clsx(styles['c-admin__header'], 'l-container')}>
					<h2 className={styles['c-admin__page-title']}>
						<label htmlFor={globalLabelKeys.adminLayout.title} title={pageTitle}>
							{pageTitle}
						</label>
					</h2>
					<div className={styles['c-admin__actions']}>{actions}</div>
				</header>
			)}

			<div className="c-admin__filter-bar">
				<div className="c-admin__filter-bar-left">{filtersLeft}</div>
				<div className="c-admin__filter-bar-right">{filtersRight}</div>
			</div>

			<div
				className={clsx('c-admin__content', {
					['c-admin__content-bottom-padding']: bottomPadding,
				})}
			>
				{content}
			</div>
		</SidebarLayout>
	);
};

AdminLayout.Actions = AdminActions;
AdminLayout.FiltersLeft = AdminFiltersLeft;
AdminLayout.FiltersRight = AdminFiltersRight;
AdminLayout.Content = AdminContent;

export default AdminLayout;
