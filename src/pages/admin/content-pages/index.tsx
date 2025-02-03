import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { ContentPageOverviewPage } from '@admin/views/content-pages/ContentPageOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import type { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageOverviewPageEnglish: NextPage<DefaultSeoInfo & UserProps> = ({
	url,
	locale,
	commonUser,
}) => {
	return <ContentPageOverviewPage url={url} locale={locale} commonUser={commonUser} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminContentPages);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageOverviewPageEnglish) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
