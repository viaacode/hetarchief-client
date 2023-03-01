import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { HTTPError } from 'ky';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { setShowZendesk } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import VisitorSpaceSearchPage from '@visitor-space/components/VisitorSpaceSearchPage/VisitorSpaceSearchPage';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceService } from '@visitor-space/services';

import { useGetContentPageByPath } from '../../../modules/content-page/hooks/get-content-page';
import { ContentPageClientService } from '../../../modules/content-page/services/content-page-client.service';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

type DynamicRouteResolverProps = {
	title: string | null;
} & DefaultSeoInfo;

// TODO: simplify this component to VisitorSpaceSearchPage
const DynamicRouteResolver: NextPage<DynamicRouteResolverProps> = ({ title, url }) => {
	const router = useRouter();
	const { slug } = router.query;
	const dispatch = useDispatch();

	/**
	 * Data
	 */

	const {
		error: visitorSpaceError,
		isLoading: isVisitorSpaceLoading,
		data: visitorSpaceInfo,
	} = useGetVisitorSpace(slug as string, true);
	const {
		error: contentPageError,
		isLoading: isContentPageLoading,
		data: contentPageInfo,
	} = useGetContentPageByPath(('/' + slug) as string);

	/**
	 * Computed
	 */

	const isVisitorSpaceNotFoundError = (visitorSpaceError as HTTPError)?.response?.status === 404;
	const isContentPageNotFoundError =
		!!contentPageInfo || (contentPageError as HTTPError)?.response?.status === 404;

	/**
	 * Effects
	 */

	useEffect(() => {
		if (isVisitorSpaceNotFoundError && isContentPageNotFoundError) {
			window.open(`${publicRuntimeConfig.PROXY_URL}/not-found`, '_self');
		}
	}, [isVisitorSpaceNotFoundError, isContentPageNotFoundError]);

	useEffect(() => {
		dispatch(setShowZendesk(true));
	}, [dispatch]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		dispatch(setShowZendesk(true));

		if (isVisitorSpaceLoading || isContentPageLoading) {
			return <Loading fullscreen owner="slug page: render page content" />;
		}
		if (visitorSpaceInfo) {
			dispatch(setShowZendesk(false));
			return <VisitorSpaceSearchPage />;
		}
		if (contentPageInfo) {
			return <ContentPageRenderer contentPageInfo={contentPageInfo} />;
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
): Promise<GetServerSidePropsResult<DynamicRouteResolverProps>> {
	let title: string | null = null;
	try {
		const [space, contentPage] = await Promise.allSettled([
			VisitorSpaceService.getBySlug(context.query.slug as string, true),
			ContentPageClientService.getBySlug(('/' + context.query.slug) as string),
		]);

		if (space.status === 'fulfilled') {
			title = space.value?.name || null;
		} else if (contentPage.status === 'fulfilled') {
			title = contentPage.value?.title || null;
		}
	} catch (err) {
		console.error(
			'Failed to fetch visitor space or content page seo info by slug: ' + context.query.slug,
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

export default withAdminCoreConfig(DynamicRouteResolver as ComponentType);
