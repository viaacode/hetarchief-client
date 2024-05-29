import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { ContentPageEditPage } from '@admin/views/content-pages/ContentPageEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageEditPageEnglish: NextPage<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	const router = useRouter();

	return <ContentPageEditPage url={url} commonUser={commonUser} id={router.query.id as string} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageEditPageEnglish) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
