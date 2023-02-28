import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectHasCheckedLogin, selectIsLoggedIn, selectUser } from '@auth/store/user';
import LoggedInHome from '@home/components/LoggedInHome/LoggedInHome';
import LoggedOutHome from '@home/components/LoggedOutHome/LoggedOutHome';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser } from '@shared/utils';

import VisitorLayout from '../../modules/visitors/layouts/VisitorLayout/VisitorLayout';

const VisitorSpacesHome: NextPage<DefaultSeoInfo> = (props) => {
	const router = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
	const user = useSelector(selectUser);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const linkedSpaceSlug: string | null = user?.visitorSpaceSlug || null;

	useNavigationBorder(!isLoggedIn);

	useEffect(() => {
		if (showLinkedSpaceAsHomepage && linkedSpaceSlug) {
			router.replace('/' + linkedSpaceSlug);
		}
	}, [showLinkedSpaceAsHomepage, linkedSpaceSlug, router]);

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

	return <VisitorLayout>{renderPageContent()}</VisitorLayout>;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default VisitorSpacesHome;
