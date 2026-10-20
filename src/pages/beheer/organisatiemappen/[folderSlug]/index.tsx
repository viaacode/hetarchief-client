import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminOrganisationFolders } from '@cp/views/CpAdminOrganisationFolders';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

const CpAdminOrganisationFoldersSlugDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();
	const folderSlug = router.query.folderSlug as string | undefined;

	return <CpAdminOrganisationFolders folderSlug={folderSlug} url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(CpAdminOrganisationFoldersSlugDutch as ComponentType, true);
