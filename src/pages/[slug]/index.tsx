import { ContentPage } from '@meemoo/react-admin';
import { HTTPError } from 'ky';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, StringParam, useQueryParams, withDefault } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY, VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal, setShowZendesk } from '@shared/store/ui';
import VisitorSpaceSearchPage from '@visitor-space/components/VisitorSpaceSearchPage/VisitorSpaceSearchPage';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

import { useGetContentPage } from '../../modules/content-page/hooks/get-content-page';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

const DynamicRouteResolver: NextPage = () => {
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
	} = useGetContentPage(slug as string, true);

	/**
	 * Computed
	 */

	const isVisitorSpaceNotFoundError = (visitorSpaceError as HTTPError)?.response?.status === 404;
	const isContentPageNotFoundError =
		(!!contentPageInfo && contentPageInfo?.exists === false) ||
		(contentPageError as HTTPError)?.response?.status === 404;

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
			return <Loading fullscreen />;
		}
		if (visitorSpaceInfo) {
			dispatch(setShowZendesk(false));
			return <VisitorSpaceSearchPage />;
		}
		if (contentPageInfo) {
			return <ContentPage path={('/' + slug) as string} userGroupId={user?.groupId} />;
		}
	};

	return (
		<VisitorLayout>
			{renderOgTags(contentPageInfo?.title || undefined, '', publicRuntimeConfig.CLIENT_URL)}
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export const getServerSideProps = withI18n();

export default withAdminCoreConfig(DynamicRouteResolver);
