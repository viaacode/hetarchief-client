import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { FC } from 'react';

import { ContentPageLabelsEditPage } from '@admin/views/content-page-labels/ContentPageLabelsEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelsEditPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <ContentPageLabelsEditPage url={url} id={undefined} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsEditPageDutch as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
