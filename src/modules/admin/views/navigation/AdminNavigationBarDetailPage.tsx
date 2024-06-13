import { NavigationDetail } from '@meemoo/admin-core-ui';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

interface AdminNavigationBarDetailPage {
	navigationBarId: string;
}

export const AdminNavigationBarDetailPage: FC<DefaultSeoInfo & AdminNavigationBarDetailPage> = ({
	url,
	navigationBarId,
}) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__detail">
						<NavigationDetail navigationBarId={navigationBarId} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText(
					'pages/admin/navigatie/navigation-bar-id/index___navigatie-balk-detail'
				)}
				description={tText(
					'pages/admin/navigatie/navigation-bar-id/index___de-detail-pagina-van-een-navigatie-balk-met-de-navigatie-items'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.EDIT_NAVIGATION_BARS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
