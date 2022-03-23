import { FC } from 'react';
import { BrowserRouter, Link, matchPath, Route, Switch } from 'react-router-dom';

import { ListNavigationItem } from '@shared/components';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';

import { NAVIGATION_ROUTES } from './navigation';
import { NAVIGATION_PATHS } from './navigation/const';

const ADMIN_ROUTES = [...NAVIGATION_ROUTES];
const ADMIN_PATHS = { navigation: NAVIGATION_PATHS };

const Admin: FC = () => {
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
	];

	return (
		// The basename prop will ensure all route paths and links are prefixed, otherwise it will
		// always try to go to the root url
		<BrowserRouter basename="/admin">
			<SidebarLayout sidebarTitle="Admin" sidebarLinks={sidebarLinks}>
				<div className="l-container u-mt-64 u-mb-48">
					<Switch>
						{/* {routes?.length > 0 && AdminCore.routes.render(routes)} */}
						{ADMIN_ROUTES.map(({ path, component }) => (
							<Route key={path} path={path} component={component} />
						))}
					</Switch>
				</div>
			</SidebarLayout>
		</BrowserRouter>
	);
};

export default Admin;
