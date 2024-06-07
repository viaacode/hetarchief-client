import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminVisitRequests } from '@admin/views/AdminVisitRequests';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminVisitRequestsEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AdminVisitRequests url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(AdminVisitRequestsEnglish as ComponentType, true);
