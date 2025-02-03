import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import type { FC } from 'react';

import { ContentPageLabelsOverviewPage } from '@admin/views/content-page-labels/ContentPageLabelsOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

export const ContentPageLabelsOverviewPageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <ContentPageLabelsOverviewPage url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminContentPageLabels);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsOverviewPageDutch as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
