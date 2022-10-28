import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, StringParam, useQueryParams, withDefault } from 'use-query-params';

import { Permission } from '@account/const';
import { AuthModal } from '@auth/components';
import { selectHasCheckedLogin, selectIsLoggedIn, selectUser } from '@auth/store/user';
import LoggedInHome from '@home/components/LoggedInHome/LoggedInHome';
import LoggedOutHome from '@home/components/LoggedOutHome/LoggedOutHome';
import { SHOW_AUTH_QUERY_KEY, VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser } from '@shared/utils';

import VisitorLayout from '../modules/visitors/layouts/VisitorLayout/VisitorLayout';

const Home: NextPage<DefaultSeoInfo> = (props) => {
	const dispatch = useDispatch();
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
		[VISITOR_SPACE_SLUG_QUERY_KEY]: withDefault(StringParam, undefined),
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
		if (typeof query[SHOW_AUTH_QUERY_KEY] === 'boolean') {
			setQuery({
				[SHOW_AUTH_QUERY_KEY]: undefined,
				[VISITOR_SPACE_SLUG_QUERY_KEY]: undefined,
			});
		}
		dispatch(setShowAuthModal(false));
	};

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (!hasCheckedLogin && isBrowser()) {
			return <Loading fullscreen owner="root index page" />;
		}
		if (isLoggedIn && !!user) {
			if (showLinkedSpaceAsHomepage && linkedSpaceSlug) {
				return <Loading fullscreen owner="root page logged" />;
			}
			return <LoggedInHome {...props} />;
		}
		return <LoggedOutHome {...props} />;
	};

	console.log('props: ', props);
	return (
		<VisitorLayout>
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default Home;
