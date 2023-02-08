import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { HTTPError } from 'ky';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, StringParam, useQueryParams, withDefault } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY, VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal, setShowZendesk } from '@shared/store/ui';
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
	useNavigationBorder();

	const router = useRouter();
	const user = useSelector(selectUser);
	const { slug } = router.query;
	const dispatch = useDispatch();
	const showAuthModal = useSelector(selectShowAuthModal);
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
		[VISITOR_SPACE_SLUG_QUERY_KEY]: withDefault(StringParam, undefined),
	});

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
	 * Methods
	 */

	const onCloseAuthModal = () => {
		if (typeof query[SHOW_AUTH_QUERY_KEY] === 'boolean') {
			setQuery({
				[SHOW_AUTH_QUERY_KEY]: undefined,
				[VISITOR_SPACE_SLUG_QUERY_KEY]: undefined,
			});
		}
		dispatch(setShowAuthModal(false));
	};

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
			return (
				<ContentPageRenderer path={('/' + slug) as string} userGroupId={user?.groupId} />
			);
		}
	};

	return (
		<VisitorLayout>
			{renderOgTags(title || undefined, '', url)}
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
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
