import { FC } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import { AdminNavigation } from './readingRooms/components';

const Admin: FC = () => {
	return (
		// The basename prop will ensure all route paths and links are prefixed, otherwise it will
		// always try to go to the root url
		<BrowserRouter basename="/admin">
			<QueryParamProvider ReactRouterRoute={Route}>
				<AdminNavigation />
			</QueryParamProvider>
		</BrowserRouter>
	);
};

export default Admin;
