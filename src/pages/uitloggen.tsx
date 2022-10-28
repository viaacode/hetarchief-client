import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';

import { AuthService } from '@auth/services/auth-service';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
import { DefaultSeoInfo } from '@shared/types/seo';

const { publicRuntimeConfig } = getConfig();

const Logout: NextPage = () => {
	useEffect(() => {
		AuthService.logout();
	}, []);

	return <Loading fullscreen owner="uitloggen" />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return {
		props: {
			url: publicRuntimeConfig.CLIENT_URL + (context?.resolvedUrl || ''),
			...(await withI18n()).props,
		},
	};
}

export default Logout;
