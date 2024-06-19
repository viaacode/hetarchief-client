import { type GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { type GetServerSidePropsContext, type NextPage } from 'next/types';
import React, { type FC } from 'react';

import { ContentPageLabelsEditPage } from '@admin/views/content-page-labels/ContentPageLabelsEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelsEditPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();

	return <ContentPageLabelsEditPage url={url} id={router.query.id as string} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsEditPageDutch as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
