import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import { FC } from 'react';

import { ContentPageLabelsOverviewPage } from '@admin/views/content-page-labels/ContentPageLabelsOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

export const ContentPageLabelsOverviewPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <ContentPageLabelsOverviewPage url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsOverviewPageDutch as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
