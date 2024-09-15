import { type GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { type GetServerSidePropsContext, type NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminNavigationItemCreatePage } from '@admin/views/navigation/AdminNavigationItemCreatePage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AdminNavigationItemCreatePageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();

	return (
		<AdminNavigationItemCreatePage
			navigationBarId={router.query.navigationBarId as string}
			url={url}
			locale={locale}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(AdminNavigationItemCreatePageDutch as ComponentType),
	true
);
