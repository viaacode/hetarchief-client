import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { CP_ADMIN_NAVIGATION_LINKS } from '@cp/const';
import { ListNavigationItem } from '@shared/components';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';

import styles from './CPAdminLayout.module.scss';
import { CPAdminLayoutProps } from './CPAdminLayout.types';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();

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

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	return (
		<SidebarLayout
			className={className}
			contentTitle={pageTitle}
			sidebarLinks={sidebarLinks}
			sidebarTitle={t('modules/cp/layouts/cp-admin-layout/cp-admin-layout___beheer')}
		>
			<ErrorBoundary>
				{pageTitle && (
					<header className={clsx(styles['c--cp-admin__header'], 'l-container')}>
						<h2 className={styles['c-cp-admin__page-title']}>{pageTitle}</h2>
					</header>
				)}
				{children}
			</ErrorBoundary>
		</SidebarLayout>
	);
};

export default CPAdminLayout;
