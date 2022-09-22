import { NextPage } from 'next';
import { useEffect } from 'react';

import { AuthService } from '@auth/services/auth-service';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';

const Logout: NextPage = () => {
	useEffect(() => {
		AuthService.logout();
	}, []);

	return <Loading fullscreen />;
};

export const getServerSideProps = withI18n();

export default Logout;
