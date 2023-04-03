import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, FC } from 'react';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

import { useGetContentPageByPath } from '../modules/content-page/hooks/get-content-page';
import { ContentPageClientService } from '../modules/content-page/services/content-page-client.service';

import { VisitorLayout } from 'modules/visitors';

type HomepageProps = {
	title: string | null;
} & DefaultSeoInfo;

const Homepage: NextPage<HomepageProps & UserProps> = ({ title, url, commonUser }) => {
	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: contentPageInfo } = useGetContentPageByPath('/');

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading) {
			return <Loading fullscreen owner="homepage" />;
		}
		if (contentPageInfo) {
			return (
				<ContentPageRenderer contentPageInfo={contentPageInfo} commonUser={commonUser} />
			);
		}
	};

	return (
		<VisitorLayout>
			{renderOgTags(title || undefined, '', url)}
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomepageProps>> {
	let title: string | null = null;
	try {
		const contentPage = await ContentPageClientService.getBySlug('/');
		title = contentPage?.title || null;
	} catch (err) {
		console.error(
			'Failed to fetch content page seo info for homepage by slug: ' + context.query.slug,
			err
		);
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> = await getDefaultServerSideProps(
		context
	);

	return {
		props: { ...(defaultProps as { props: DefaultSeoInfo }).props, title },
	};
}

export default withAdminCoreConfig(
	withUser(withAuth(Homepage as ComponentType, false) as FC<unknown>)
) as FC<HomepageProps>;
