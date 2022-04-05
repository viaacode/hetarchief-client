import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AdminNavigation } from './readingRooms/components';

const Admin: FC = () => {
	return (
		// The basename prop will ensure all route paths and links are prefixed, otherwise it will
		// always try to go to the root url
		<BrowserRouter basename="/admin">
			<AdminNavigation />
		</BrowserRouter>
	);
};

export default Admin;
