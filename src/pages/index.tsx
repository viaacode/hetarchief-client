import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { AuthModal } from '@auth/components';
import { selectHasCheckedLogin, selectIsLoggedIn, selectUser } from '@auth/store/user';
import LoggedInHome from '@home/components/LoggedInHome/LoggedInHome';
import LoggedOutHome from '@home/components/LoggedOutHome/LoggedOutHome';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';

import VisitorLayout from '../modules/visitors/layouts/VisitorLayout/VisitorLayout';

const Home: NextPage = () => {
	const dispatch = useDispatch();
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	const router = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
	const showAuthModal = useSelector(selectShowAuthModal);
	const user = useSelector(selectUser);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const linkedSpaceSlug: string | null = user?.visitorSpaceSlug || null;

	useNavigationBorder(!isLoggedIn);

	// Sync showAuth query param with store value
	useEffect(() => {
		if (typeof query.showAuth === 'boolean') {
			dispatch(setShowAuthModal(query.showAuth));
		}
	}, [dispatch, query.showAuth]);

	useEffect(() => {
		if (showLinkedSpaceAsHomepage && linkedSpaceSlug) {
			router.replace('/' + linkedSpaceSlug);
		}
	}, [showLinkedSpaceAsHomepage, linkedSpaceSlug, router]);

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
		if (!hasCheckedLogin) {
			return <Loading fullscreen />;
		}
		if (isLoggedIn && !!user) {
			if (showLinkedSpaceAsHomepage && linkedSpaceSlug) {
				return <Loading fullscreen />;
			}
			return <LoggedInHome />;
		}
		return <LoggedOutHome />;
	};

	return (
		<VisitorLayout>
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default Home;
