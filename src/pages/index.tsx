import {
	AdminConfig,
	AdminConfigManager,
	ContentPageRenderer,
	convertDbContentPageToContentPageInfo,
} from '@meemoo/admin-core-ui';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, useEffect } from 'react';

import { GroupName } from '@account/const';
import { adminCoreConfig, initAdminCoreConfig } from '@admin/wrappers/admin-core-config';
import { prefetchCheckLogin } from '@auth/wrappers/with-auth/useCheckLogin';
import { prefetchGetTos } from '@auth/wrappers/with-auth/useGetTos';
import { Loading } from '@shared/components';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

import {
	prefetchGetContentPageByPath,
	useGetContentPageByPath,
} from '../modules/content-page/hooks/get-content-page';

import { VisitorLayout } from 'modules/visitors';

type HomepageProps = {
	// title: string | null;
	// description: string | null;
	// image: string | null;
} & DefaultSeoInfo;

const Homepage: NextPage<HomepageProps & UserProps> = ({
	// title,
	// description,
	// image,
	url,
	commonUser,
}) => {
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const router = useRouter();

	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: dbContentPage } = useGetContentPageByPath('/');

	// Server side rendering vs client side rendering import module issue
	const config = ((adminCoreConfig as any)?.adminCoreConfig || adminCoreConfig) as AdminConfig;

	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(
				dbContentPage,
				config.services.toastService.showToast,
				config.services.i18n.tText
		  )
		: null;

	useEffect(() => {
		if (isKioskUser) {
			router.replace(ROUTES.search);
		}
	}, [router, isKioskUser]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading || isKioskUser || !AdminConfigManager.getConfig()) {
			return <Loading fullscreen owner="homepage" />;
		}
		if (contentPageInfo && AdminConfigManager.getConfig()) {
			return (
				<ContentPageRenderer contentPageInfo={contentPageInfo} commonUser={commonUser} />
			);
		}
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				contentPageInfo?.title || null,
				contentPageInfo?.seoDescription || contentPageInfo?.description || null,
				url,
				undefined,
				contentPageInfo?.thumbnailPath || null
			)}
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomepageProps>> {
	// react-query prefetching data for server side rendering
	const queryClient = new QueryClient();

	initAdminCoreConfig();
	await prefetchGetContentPageByPath('/', queryClient);
	await prefetchCheckLogin(queryClient);
	await prefetchGetTos(queryClient);

	// let title: string | null = null;
	// let description: string | null = null;
	// let image: string | null = null;
	// try {
	// 	const contentPage = await ContentPageClientService.getBySlug('/');
	// 	title = contentPage?.title || null;
	// 	description = contentPage?.seoDescription || contentPage?.description || null;
	// 	image = contentPage?.thumbnailPath || null;
	// } catch (err) {
	// 	console.error(
	// 		'Failed to fetch content page seo info for homepage by slug: ' + context.query.slug,
	// 		err
	// 	);
	// }

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> =
		await getDefaultServerSideProps(context);

	return {
		props: {
			...(defaultProps as { props: DefaultSeoInfo }).props,
			// title,
			// description,
			// image,
			dehydratedState: dehydrate(queryClient),
		},
	};
}

export default withUser(Homepage as ComponentType) as ComponentType;
