'use client';
// https://github.com/vercel/next.js/issues/47232

import { type Avo } from '@viaa/avo2-types';
import { type GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { type GetServerSidePropsContext, type NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { ContentPageDetailPage } from '@admin/views/content-pages/ContentPageDetailPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { type DefaultSeoInfo } from '@shared/types/seo';

const ContentPageDetailPageDutch: NextPage<DefaultSeoInfo & UserProps> = ({
	url,
	locale,
	commonUser,
}) => {
	const router = useRouter();

	return (
		<ContentPageDetailPage
			url={url}
			locale={locale}
			commonUser={commonUser as Avo.User.CommonUser}
			id={router.query.id as string}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageDetailPageDutch) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
