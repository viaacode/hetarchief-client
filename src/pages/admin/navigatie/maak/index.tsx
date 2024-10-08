import { type GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { type GetServerSidePropsContext, type NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminNavigationItemCreatePage } from '@admin/views/navigation/AdminNavigationItemCreatePage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AdminNavigationItemCreatePageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();

	return (
		<AdminNavigationItemCreatePage
			url={url}
			locale={locale}
			navigationBarId={router.query.navigationBarId as string}
		/>
	);
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminNavigationCreate);
}

export default withAuth(
	withAdminCoreConfig(AdminNavigationItemCreatePageDutch as ComponentType),
	true
);
