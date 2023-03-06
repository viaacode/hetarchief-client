import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user';
import {
	CP_ADMIN_NAVIGATION_BOTTOM_LINKS,
	CP_ADMIN_NAVIGATION_TOP_LINKS,
	CP_ADMIN_SEARCH_VISITOR_SPACE_KEY,
} from '@cp/const';
import { CPAdminLayoutProps } from '@cp/layouts';
import { ListNavigationItem } from '@shared/components';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { globalLabelKeys } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import styles from './CPAdminLayout.module.scss';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();
	const { tHtml } = useTranslation();

	const user = useSelector(selectUser);

	const sidebarLinksTop: ListNavigationItem[] = useMemo(
		() =>
			CP_ADMIN_NAVIGATION_TOP_LINKS().map(({ id, label, href }) => ({
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

	const sidebarLinksBottom: ListNavigationItem[] = useMemo(
		() =>
			CP_ADMIN_NAVIGATION_BOTTOM_LINKS().map(({ id, label, href }) => {
				const url =
					id !== CP_ADMIN_SEARCH_VISITOR_SPACE_KEY
						? href
						: stringifyUrl({
								url: href,
								query: {
									[VisitorSpaceFilterId.Maintainer]: user?.maintainerId,
								},
						  });

				return {
					id,
					node: ({ linkClassName }) => (
						<Link href={url}>
							<a className={linkClassName} aria-label={label}>
								{label}
							</a>
						</Link>
					),
					active: asPath.includes(url),
				};
			}),
		[asPath, user]
	);

	useEffect(() => {
		dispatch(setShowZendesk(true));
	}, [dispatch]);

	return (
		<SidebarLayout
			className={className}
			sidebarLinksTop={sidebarLinksTop}
			sidebarLinksBottom={sidebarLinksBottom}
			sidebarTitle={tHtml('modules/cp/layouts/cp-admin-layout/cp-admin-layout___beheer')}
		>
			<ErrorBoundary>
				{pageTitle && (
					<header className={clsx(styles['c--cp-admin__header'], 'l-container')}>
						<h2 className={styles['c-cp-admin__page-title']}>
							<label htmlFor={globalLabelKeys.adminLayout.title}>{pageTitle}</label>
						</h2>
					</header>
				)}
				{children}
			</ErrorBoundary>
		</SidebarLayout>
	);
};

export default CPAdminLayout;
