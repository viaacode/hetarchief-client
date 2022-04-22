import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { generatePath, Link, matchPath, Route, Switch, useLocation } from 'react-router-dom';

import { ListNavigationItem } from '@shared/components';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';

import { READING_ROOMS_ROUTES } from '../../';
import { READING_ROOMS_PATHS } from '../../const';

import { AdminNavigationProps } from './AdminNavigation.types';

const ADMIN_ROUTES = [...READING_ROOMS_ROUTES];
const ADMIN_PATHS = { readingRooms: READING_ROOMS_PATHS };

const AdminNavigation: FC<AdminNavigationProps> = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();

	const sidebarLinks: ListNavigationItem[] = [
		{
			id: 'leeszalenbeheer',
			node: (
				<div className={'u-p-16 u-pl-32'}>
					{t(
						'modules/admin/reading-rooms/components/admin-navigation/admin-navigation___leeszalenbeheer'
					)}
				</div>
			),
			children: [
				{
					id: 'leeszalen',
					node: ({ linkClassName }) => (
						<Link
							key={pathname}
							className={linkClassName}
							to={generatePath(ADMIN_PATHS.readingRooms.leeszalen, {
								slug: 'leeszalen',
							})}
						>
							{t(
								'modules/admin/reading-rooms/components/admin-navigation/admin-navigation___alle-leeszalen'
							)}
						</Link>
					),
					active:
						!!matchPath(window.location.pathname, {
							path: `/admin${generatePath(ADMIN_PATHS.readingRooms.leeszalen, {
								slug: 'leeszalen',
							})}`,
							exact: false,
						}) ||
						// Match edit state
						!!matchPath(window.location.pathname, {
							path: `/admin${generatePath(ADMIN_PATHS.readingRooms.edit, {
								slug: ':id',
							})}`,
							exact: false,
						}),
				},
				{
					id: 'aanvragen',
					node: ({ linkClassName }) => (
						<Link
							key={pathname}
							className={linkClassName}
							to={generatePath(ADMIN_PATHS.readingRooms.aanvragen, {
								slug: 'aanvragen',
							})}
						>
							{t(
								'modules/admin/reading-rooms/components/admin-navigation/admin-navigation___aanvragen'
							)}
						</Link>
					),
					active: !!matchPath(window.location.pathname, {
						path: `/admin${generatePath(ADMIN_PATHS.readingRooms.aanvragen, {
							slug: 'aanvragen',
						})}`,
						exact: false,
					}),
				},
				{
					id: 'actieve-bezoekers',
					node: ({ linkClassName }) => (
						<Link
							key={pathname}
							className={linkClassName}
							to={generatePath(ADMIN_PATHS.readingRooms.bezoekers, {
								slug: 'bezoekers',
							})}
						>
							{t(
								'modules/admin/reading-rooms/components/admin-navigation/admin-navigation___actieve-bezoekers'
							)}
						</Link>
					),
					active: !!matchPath(window.location.pathname, {
						path: `/admin${generatePath(ADMIN_PATHS.readingRooms.bezoekers, {
							slug: 'bezoekers',
						})}`,
						exact: false,
					}),
				},
			],
		},
	];

	return (
		<SidebarLayout sidebarTitle="Admin" sidebarLinks={sidebarLinks}>
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
