import clsx from 'clsx';
import { isNil } from 'lodash-es';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user';
import { CP_ADMIN_NAVIGATION_LINKS, CP_ADMIN_SEARCH_VISITOR_SPACE_KEY } from '@cp/const';
import type { CPAdminLayoutProps } from '@cp/layouts';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import { Icon } from '@shared/components/Icon';
import type { ListNavigationItem } from '@shared/components/ListNavigation';
import { globalLabelKeys } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import SidebarLayout from '@shared/layouts/SidebarLayout/SidebarLayout';
import { setShowZendesk } from '@shared/store/ui';
import { SearchFilterId } from '@visitor-space/types';

import styles from './CPAdminLayout.module.scss';

const CPAdminLayout: FC<CPAdminLayoutProps> = ({ children, className, pageTitle }) => {
	const { asPath } = useRouter();
	const dispatch = useDispatch();
	const locale = useLocale();

	const user = useSelector(selectUser);

	const sidebarLinks: ListNavigationItem[] = useMemo(
		() =>
			CP_ADMIN_NAVIGATION_LINKS(locale).map(({ id, label, href, iconName }) => {
				const url =
					id !== CP_ADMIN_SEARCH_VISITOR_SPACE_KEY
						? href
						: stringifyUrl({
								url: href,
								query: {
									[SearchFilterId.Maintainer]: user?.visitorSpaceSlug,
								},
							});

				return {
					id,
					node: ({ linkClassName }) => (
						<Link href={url} className={linkClassName} aria-label={label}>
							{!isNil(iconName) && <Icon className="u-mr-4" name={iconName} />}
							<span>{label}</span>
						</Link>
					),
					active: asPath.includes(url),
				};
			}),
		[asPath, locale, user?.visitorSpaceSlug]
	);

	useEffect(() => {
		dispatch(setShowZendesk(true));
	}, [dispatch]);

	return (
		<SidebarLayout
			className={className}
			sidebarLinks={sidebarLinks}
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
