import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

import { AuthService } from '@auth/services/auth-service';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const Logout: NextPage = () => {
	useEffect(() => {
		AuthService.logout();
	}, []);

	return <Loading fullscreen owner="uitloggen" />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default Logout;
