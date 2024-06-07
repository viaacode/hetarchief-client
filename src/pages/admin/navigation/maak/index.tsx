import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminNavigationItemCreatePage } from '@admin/views/navigation/AdminNavigationItemCreatePage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminNavigationItemCreatePageEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();

	return (
		<AdminNavigationItemCreatePage
			url={url}
			navigationBarId={router.query.navigationBarId as string}
		/>
	);
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(AdminNavigationItemCreatePageEnglish as ComponentType),
	true
);
