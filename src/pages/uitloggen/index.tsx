import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

import { AuthService } from '@auth/services/auth-service';
import { Loading } from '@shared/components/Loading';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const Logout: NextPage = () => {
	useEffect(() => {
		AuthService.logout();
	}, []);

	return <Loading fullscreen owner="uitloggen" />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.logout);
}

export default Logout;
