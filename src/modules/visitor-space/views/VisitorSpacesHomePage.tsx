import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectHasCheckedLogin, selectIsLoggedIn, selectUser } from '@auth/store/user';
import LoggedInHome from '@home/components/LoggedInHome/LoggedInHome';
import LoggedOutHome from '@home/components/LoggedOutHome/LoggedOutHome';
import { Loading } from '@shared/components';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser } from '@shared/utils';

import { VisitorLayout } from 'modules/visitor-layout';

export const VisitorSpacesHomePage: FC<DefaultSeoInfo> = (props) => {
	const router = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
	const user = useSelector(selectUser);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const linkedSpaceSlug: string | null = user?.visitorSpaceSlug || null;

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
