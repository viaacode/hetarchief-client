import { ThemesEditPage } from '@admin/views/themes/ThemesEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type FC } from 'react';

const ThemesEditPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();

	return <ThemesEditPage url={url} locale={locale} id={router.query.id as string} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(ThemesEditPageEnglish as FC<unknown>),
	true
) as NextPage<DefaultSeoInfo>;
