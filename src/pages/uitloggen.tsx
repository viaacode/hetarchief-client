import { NextPage } from 'next';
import { useEffect } from 'react';

import { AuthService } from '@auth/services/auth-service';
import { Loading } from '@shared/components';

const Logout: NextPage = () => {
	useEffect(() => {
		AuthService.logout();
	}, []);

	return <Loading fullscreen />;
};

export default Logout;
