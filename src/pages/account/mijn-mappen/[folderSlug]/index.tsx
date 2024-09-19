import { type GetServerSidePropsResult, type NextPage } from 'next';
import { useRouter } from 'next/router';
import { type GetServerSidePropsContext } from 'next/types';
import { type ComponentType } from 'react';

import { AccountMyFolders } from '@account/views/MyFolders';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AccountMyFoldersDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();
	const folderSlug = router.query.folderSlug as string | undefined;

	return <AccountMyFolders folderSlug={folderSlug} url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(AccountMyFoldersDutch as ComponentType, true);
