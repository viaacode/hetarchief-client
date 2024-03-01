import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, FC, useEffect } from 'react';

import { GroupName } from '@account/const';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { Loading } from '@shared/components';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

import { useGetContentPageByPath } from '../modules/content-page/hooks/get-content-page';
import { ContentPageClientService } from '../modules/content-page/services/content-page-client.service';

import { VisitorLayout } from 'modules/visitors';

type HomepageProps = {
	title: string | null;
	description: string | null;
	image: string | null;
} & DefaultSeoInfo;

const Homepage: NextPage<HomepageProps & UserProps> = ({
	title,
	description,
	image,
	url,
	commonUser,
}) => {
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const router = useRouter();

	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: contentPageInfo } = useGetContentPageByPath('/');

	useEffect(() => {
		if (isKioskUser) {
			router.replace(ROUTES.search);
		}
	}, [router, isKioskUser]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading || isKioskUser) {
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
			test og tags
			{renderOgTags(
				title,
				description ||
					contentPageInfo?.seoDescription ||
					contentPageInfo?.description ||
					null,
				url,
				undefined,
				image || contentPageInfo?.thumbnailPath || null
			)}
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomepageProps>> {
	let title: string | null = null;
	let description: string | null = null;
	let image: string | null = null;
	try {
		const contentPage = await ContentPageClientService.getBySlug('/');
		title = contentPage?.title || null;
		description = contentPage?.seoDescription || contentPage?.description || null;
		image = contentPage?.thumbnailPath || null;
	} catch (err) {
		console.error(
			'Failed to fetch content page seo info for homepage by slug: ' + context.query.slug,
			err
		);
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> =
		await getDefaultServerSideProps(context);

	return {
		props: { ...(defaultProps as { props: DefaultSeoInfo }).props, title, description, image },
	};
}

export default withAdminCoreConfig(
	withUser(withAuth(Homepage as ComponentType, false)) as ComponentType
) as FC<HomepageProps>;
