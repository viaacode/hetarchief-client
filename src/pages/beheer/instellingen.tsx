import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminSettingsPage } from '@cp/views/CpAdminSettingsPage';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const CpAdminSettingsPageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <CpAdminSettingsPage url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.cpAdminSettings);
}

export default withAuth(CpAdminSettingsPageDutch as ComponentType, true);
