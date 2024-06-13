import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { AdminActiveVisitors } from '@admin/views/AdminActiveVisitors';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminActiveVisitorsEnglish: FC<DefaultSeoInfo> = ({ url }) => {
	return <AdminActiveVisitors url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminActiveVisitors);
}

export default withAuth(AdminActiveVisitorsEnglish as ComponentType, true);
