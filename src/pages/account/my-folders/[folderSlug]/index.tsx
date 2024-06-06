import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType } from 'react';

import { AccountMyFolders } from '@account/views/MyFolders';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AccountMyFoldersEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();
	const folderSlug = router.query.folderSlug as string | undefined;

	return <AccountMyFolders folderSlug={folderSlug} url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(AccountMyFoldersEnglish as ComponentType, true);
