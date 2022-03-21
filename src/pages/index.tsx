import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import LoggedInHome from '@home/components/LoggedInHome/LoggedInHome';
import LoggedOutHome from '@home/components/LoggedOutHome/LoggedOutHome';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';

import VisitorLayout from '../modules/visitors/layouts/VisitorLayout/VisitorLayout';

const Home: NextPage = () => {
	const dispatch = useDispatch();
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	const isLoggedIn = useSelector(selectIsLoggedIn);
	const showAuthModal = useSelector(selectShowAuthModal);
	const user = useSelector(selectUser);

	useNavigationBorder(!isLoggedIn);

	// Sync showAuth query param with store value
	useEffect(() => {
		if (typeof query.showAuth === 'boolean') {
			dispatch(setShowAuthModal(query.showAuth));
		}
	}, [dispatch, query.showAuth]);

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

	return (
		<VisitorLayout>
			{isLoggedIn && !!user ? <LoggedInHome /> : <LoggedOutHome />}
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default Home;
