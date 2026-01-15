import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { UserConditions } from '@user-conditions/UserConditions';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

const UserConditionsEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <UserConditions url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.userPolicy);
}

export default withAdminCoreConfig(
	UserConditionsEnglish as ComponentType
) as NextPage<DefaultSeoInfo>;
