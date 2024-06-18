import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import LoggedInVisitorSpacesHome from '@home/components/LoggedInVisitorSpacesHome/LoggedInVisitorSpacesHome';
import LoggedOutVisitorSpacesHome from '@home/components/LoggedOutVisitorSpacesHome/LoggedOutVisitorSpacesHome';
import { Loading } from '@shared/components';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorLayout } from '@visitor-layout/index';

export const VisitorSpacesHomePage: FC<DefaultSeoInfo> = (props) => {
	const router = useRouter();
	const isLoggedIn = useSelector(selectIsLoggedIn);
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
		if (isLoggedIn && !!user) {
			if (showLinkedSpaceAsHomepage && linkedSpaceSlug) {
				return <Loading fullscreen owner="root page logged" />;
			}
			return <LoggedInVisitorSpacesHome />;
		}
		return <LoggedOutVisitorSpacesHome />;
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={tText(
					'modules/visitor-space/views/visitor-spaces-home-page___bezoek-pagina-titel'
				)}
				description={tText(
					'modules/visitor-space/views/visitor-spaces-home-page___bezoek-pagina-beschrijving'
				)}
				relativeUrl={props.url}
				translatedPages={[]}
				imgUrl={undefined}
			/>
			{renderPageContent()}
		</VisitorLayout>
	);
};
