import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminSettingsPage } from '@cp/views/CpAdminSettingsPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const CpAdminSettingsPageEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <CpAdminSettingsPage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(CpAdminSettingsPageEnglish as ComponentType, true);