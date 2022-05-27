import { ContentPage } from '@meemoo/react-admin';
import { HTTPError } from 'ky';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import VisitorSpaceSearchPage from '@reading-room/components/VisitorSpaceSearchPage/VisitorSpaceSearchPage';
import { useGetVisitorSpace } from '@reading-room/hooks/get-visitor-space';
import { ErrorNotFound, Loading } from '@shared/components';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';

import { useGetContentPage } from '../../modules/content-page/hooks/get-content-page';

import { VisitorLayout } from 'modules/visitors';

const DynamicRouteResolver: NextPage = () => {
	useNavigationBorder();

	const router = useRouter();
	const user = useSelector(selectUser);
	const { slug } = router.query;
	const dispatch = useDispatch();
	const showAuthModal = useSelector(selectShowAuthModal);
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	/**
	 * Data
	 */

	const {
		error: visitorSpaceError,
		isLoading: isVisitorSpaceLoading,
		data: visitorSpaceInfo,
	} = useGetVisitorSpace(slug as string);
	const {
		error: contentPageError,
		isLoading: isContentPageLoading,
		data: contentPageInfo,
	} = useGetContentPage(slug as string);

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
		if (typeof query.showAuth === 'boolean') {
			setQuery({ showAuth: undefined });
		}
		dispatch(setShowAuthModal(false));
	};

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isVisitorSpaceLoading || isContentPageLoading) {
			return <Loading fullscreen />;
		}
		if (isVisitorSpaceNotFoundError && isContentPageNotFoundError) {
			return <ErrorNotFound />;
		}
		if (visitorSpaceInfo) {
			return <VisitorSpaceSearchPage />;
		}
		if (contentPageInfo) {
			return <ContentPage path={('/' + slug) as string} userGroupId={user?.groupId} />;
		}
	};

	return (
		<VisitorLayout>
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAdminCoreConfig(DynamicRouteResolver);
