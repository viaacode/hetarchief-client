import { HTTPError } from 'ky';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import VisitorSpaceSearchPage from '@reading-room/components/VisitorSpaceSearchPage/VisitorSpaceSearchPage';
import { useGetVisitorSpace } from '@reading-room/hooks/get-reading-room';
import { ErrorNotFound, Loading } from '@shared/components';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';

import { VisitorLayout } from 'modules/visitors';

const DynamicRouteResolver: NextPage = () => {
	useNavigationBorder();

	const router = useRouter();

	const { slug } = router.query;
	const dispatch = useDispatch();
	const showAuthModal = useSelector(selectShowAuthModal);
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	/**
	 * Data
	 */
	const { error: visitorSpaceError, isLoading: isVisitorSpaceLoading } = useGetVisitorSpace(
		slug as string
	);

	/**
	 * Computed
	 */

	const isVisitorSpaceNotFoundError = (visitorSpaceError as HTTPError)?.response?.status === 404;

	// TODO make backend call to determine if content page exists and is accessible for the user
	const isContentPageNotFoundError =
		router.asPath === '/over-leeszalen' || router.asPath === '/faq';
	const isContentPageLoading = false;

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
		return <VisitorSpaceSearchPage />;
	};

	return (
		<VisitorLayout>
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default DynamicRouteResolver;
