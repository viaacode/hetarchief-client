import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type FC } from 'react';

import { ContentPageLabelsDetailPage } from '@admin/views/content-page-labels/ContentPageLabelsDetailPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelsDetailPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <ContentPageLabelsDetailPage url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsDetailPageEnglish as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
