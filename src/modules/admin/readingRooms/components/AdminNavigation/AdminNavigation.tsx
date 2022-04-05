import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { generatePath, Link, matchPath, Route, Switch, useLocation } from 'react-router-dom';

import { ListNavigationItem } from '@shared/components';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';

import { READING_ROOMS_ROUTES } from '../../';
import { READING_ROOMS_PATHS } from '../../const';

import { AdminNavigationProps } from './AdminNavigation.types';

import { NAVIGATION_ROUTES } from 'modules/admin/navigation';
import { NAVIGATION_PATHS } from 'modules/admin/navigation/const';

const ADMIN_ROUTES = [...NAVIGATION_ROUTES, ...READING_ROOMS_ROUTES];
const ADMIN_PATHS = { navigation: NAVIGATION_PATHS, readingRooms: READING_ROOMS_PATHS };

const AdminNavigation: FC<AdminNavigationProps> = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();

	const sidebarLinks: ListNavigationItem[] = [
		{
			id: 'navigation',
			node: ({ linkClassName }) => (
				<Link className={linkClassName} to={ADMIN_PATHS.navigation.overview}>
					Navigatie
				</Link>
			),
			active: !!matchPath(window.location.pathname, {
				path: `/admin${ADMIN_PATHS.navigation.overview}`,
				exact: false,
			}),
		},
		{
			id: 'leeszalenbeheer',
			node: <div className={'u-p-16 u-pl-32'}>{t('Leeszalenbeheer')}</div>,
			children: [
				{
					id: 'alleleeszalen',
					node: ({ linkClassName }) => (
						<Link
							className={linkClassName}
							to={generatePath(ADMIN_PATHS.readingRooms.detail, {
								pageName: 'alleleeszalen',
							})}
						>
							{t('Alle leeszalen')}
						</Link>
					),
					active: !!matchPath(window.location.pathname, {
						path: `/admin${generatePath(ADMIN_PATHS.readingRooms.detail, {
							pageName: 'alleleeszalen',
						})}`,
						exact: false,
					}),
				},
				{
					id: 'aanvragen',
					node: ({ linkClassName }) => (
						<Link
							className={linkClassName}
							to={generatePath(ADMIN_PATHS.readingRooms.detail, {
								pageName: 'aanvragen',
							})}
						>
							{t('Aanvragen')}
						</Link>
					),
					active: !!matchPath(window.location.pathname, {
						path: `/admin${generatePath(ADMIN_PATHS.readingRooms.detail, {
							pageName: 'aanvragen',
						})}`,
						exact: false,
					}),
				},
			],
		},
	];

	return (
		<SidebarLayout key={pathname} sidebarTitle="Admin" sidebarLinks={sidebarLinks}>
			<div className="l-container u-mt-64 u-mb-48">
				<Switch>
					{/* {routes?.length > 0 && AdminCore.routes.render(routes)} */}
					{ADMIN_ROUTES.map(({ path, component }) => (
						<Route key={path} path={path} component={component} exact />
					))}
				</Switch>
			</div>
		</SidebarLayout>
	);
};

export default AdminNavigation;
