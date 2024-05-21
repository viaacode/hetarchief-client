'use client';
// https://github.com/vercel/next.js/issues/47232

import { type Avo } from '@viaa/avo2-types';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { ContentPageDetailPage } from '@admin/views/content-pages/ContentPageDetailPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageDetailPageEnglish: NextPage<DefaultSeoInfo & UserProps> = ({
	url,
	commonUser,
}) => {
	const router = useRouter();

	return (
		<ContentPageDetailPage
			url={url}
			commonUser={commonUser as Avo.User.CommonUser}
			id={router.query.id as string}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageDetailPageEnglish) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
