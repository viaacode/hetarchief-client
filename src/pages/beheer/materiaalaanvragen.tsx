import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminMaterialRequests } from '@cp/views/CpAdminMaterialRequests';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const CpAdminMaterialRequestsPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <CpAdminMaterialRequests url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(CpAdminMaterialRequestsPageDutch as ComponentType, true);
