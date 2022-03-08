// import { AdminCore, useModuleRoutes } from '@meemoo/react-admin';
import { NextPage } from 'next';
import { BrowserRouter, Switch } from 'react-router-dom';

const Admin: NextPage = () => {
	// const [routes] = useModuleRoutes(false);

	return (
		<BrowserRouter basename="/admin">
			<Switch>{/* {routes?.length > 0 && AdminCore.routes.render(routes)} */}</Switch>
		</BrowserRouter>
	);
};

export default Admin;
