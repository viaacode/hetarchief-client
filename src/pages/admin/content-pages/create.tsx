import { ContentPageEditPage } from '@admin/views/content-pages/ContentPageEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

const ContentPageEditPageEnglish: NextPage<DefaultSeoInfo & UserProps> = ({
	url,
	locale,
	commonUser,
}) => {
	return (
		<ContentPageEditPage
			url={url}
			locale={locale}
			commonUser={commonUser as AvoUserCommonUser}
			id={undefined}
		/>
	);
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminContentPageCreate);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageEditPageEnglish) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
