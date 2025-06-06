import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ComponentType } from 'react';

import { AccountAcceptSharedFolder } from '@account/views/AccountAcceptSharedFolder';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AccountSharedFolderEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();

	const folderId = router.asPath.split('/').pop();

	return <AccountAcceptSharedFolder url={url} locale={locale} folderId={folderId} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(AccountSharedFolderEnglish as ComponentType, true);
