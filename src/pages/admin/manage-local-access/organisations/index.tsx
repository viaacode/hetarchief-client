import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminVisitorSpacesOverview } from '@admin/views/visitor-spaces/AdminVisitorSpacesOverview';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const VisitorSpacesOverviewEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AdminVisitorSpacesOverview url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(VisitorSpacesOverviewEnglish as ComponentType, true);
