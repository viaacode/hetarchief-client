import { type GetServerSidePropsResult } from 'next';
import { type GetServerSidePropsContext, type NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminVisitorSpacesOverview } from '@admin/views/visitor-spaces/AdminVisitorSpacesOverview';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const VisitorSpacesOverviewEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminVisitorSpacesOverview url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminVisitorSpaces);
}

export default withAuth(VisitorSpacesOverviewEnglish as ComponentType, true);
