import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { FC } from 'react';

import { ContentPageLabelsDetailPage } from '@admin/views/content-page-labels/ContentPageLabelsDetailPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelsDetailPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <ContentPageLabelsDetailPage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsDetailPageDutch as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
