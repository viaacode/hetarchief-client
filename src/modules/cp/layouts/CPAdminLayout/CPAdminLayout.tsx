import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { ListNavigation, ListNavigationItem, Sidebar } from '@shared/components';

import { CP_ADMIN_NAVIGATION_LINKS } from '../../const';

import styles from './CPAdminLayout.module.scss';
import { CPAdminLayoutProps } from './CPAdminLayout.types';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ pageTitle, children, className }) => {
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
		<div className={clsx(styles['l-cp-admin'], 'u-bg-platinum', className)}>
			<div className={clsx(styles['l-cp-admin__navigation'], 'u-bg-white')}>
				<Sidebar
					className={styles['l-cp-admin__sidebar']}
					title={t('modules/cp/layouts/cp-admin-layout/cp-admin-layout___beheer')}
				>
					<ListNavigation listItems={sidebarLinks} />
				</Sidebar>
			</div>

			<div className={styles['l-cp-admin__main']}>
				<div className={clsx(styles['l-cp-admin__content'], 'l-container', 'u-mt-64')}>
					{pageTitle && (
						<h1 className={clsx(styles['l-cp-admin__title'], 'u-mb-48')}>
							{pageTitle}
						</h1>
					)}
				</div>

				{children}
			</div>
		</div>
	);
};

export default CPAdminLayout;
