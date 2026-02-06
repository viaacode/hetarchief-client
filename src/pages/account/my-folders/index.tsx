import { withAuth } from '@auth/wrappers/with-auth';
import { Loading } from '@shared/components/Loading';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import { type ComponentType, useEffect } from 'react';

const AccountMyFoldersEnglish: NextPage<DefaultSeoInfo> = () => {
	const router = useRouter();
	useEffect(() => {
		router.replace(ROUTES_BY_LOCALE.en.accountMyFoldersFavorites);
	}, [router.replace]);

	return <Loading locationId="my folders english" fullscreen />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(AccountMyFoldersEnglish as ComponentType, true);
