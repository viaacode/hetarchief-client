import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import React, { type ComponentType, type FC } from 'react';

import { AdminActiveVisitors } from '@admin/views/AdminActiveVisitors';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AdminActiveVisitorsEnglish: FC<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminActiveVisitors url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminActiveVisitors);
}

export default withAuth(AdminActiveVisitorsEnglish as ComponentType, true);
