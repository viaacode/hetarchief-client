import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type FC } from 'react';

import { ContentPageLabelsEditPage } from '@admin/views/content-page-labels/ContentPageLabelsEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelsEditPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <ContentPageLabelsEditPage url={url} locale={locale} id={undefined} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminContentPageLabelCreate);
}

export default withAuth(
	withAdminCoreConfig(ContentPageLabelsEditPageEnglish as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
