import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminNavigationItemEditPage } from '@admin/views/navigation/AdminNavigationItemEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminNavigationItemEditPageEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();

	return (
		<AdminNavigationItemEditPage
			navigationBarId={router.query.navigationBarId as string}
			navigationItemId={router.query.navigationItemId as string}
			url={url}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(AdminNavigationItemEditPageEnglish as ComponentType),
	true
);