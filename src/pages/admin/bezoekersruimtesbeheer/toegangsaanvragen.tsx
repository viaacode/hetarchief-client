import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminVisitRequests } from '@admin/views/AdminVisitRequests';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminVisitRequestsDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AdminVisitRequests url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, undefined, ROUTES_BY_LOCALE.nl.adminVisitRequests);
}

export default withAuth(AdminVisitRequestsDutch as ComponentType, true);
