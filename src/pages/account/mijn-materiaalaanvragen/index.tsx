import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import { type ComponentType } from 'react';

import { AccountMyMaterialRequests } from '@account/views/MyMaterialRequests';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AccountMyMaterialRequestsDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AccountMyMaterialRequests url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.accountMyMaterialRequests);
}

export default withAuth(AccountMyMaterialRequestsDutch as ComponentType, true);
