import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminMaterialRequests } from '@admin/views/AdminMaterialRequests';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AdminMaterialRequestsDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminMaterialRequests url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminMaterialRequests);
}

export default withAuth(AdminMaterialRequestsDutch as ComponentType, true);
