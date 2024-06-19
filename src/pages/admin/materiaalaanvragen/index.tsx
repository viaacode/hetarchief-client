import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminMaterialRequests } from '@admin/views/AdminMaterialRequests';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AdminMaterialRequestsDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AdminMaterialRequests url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminMaterialRequests);
}

export default withAuth(AdminMaterialRequestsDutch as ComponentType, true);
