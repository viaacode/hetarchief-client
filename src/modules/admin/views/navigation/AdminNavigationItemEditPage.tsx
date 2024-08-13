import { NavigationEdit } from '@meemoo/admin-core-ui';
import React, { type FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';

interface NavigationPageCreatePageProps {
	navigationBarId: string;
	navigationItemId: string;
}

export const AdminNavigationItemEditPage: FC<DefaultSeoInfo & NavigationPageCreatePageProps> = ({
	url,
	navigationBarId,
	navigationItemId,
}) => {
	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__create">
						<NoServerSideRendering>
							<NavigationEdit
								navigationBarId={navigationBarId}
								navigationItemId={navigationItemId}
							/>
						</NoServerSideRendering>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText('pages/admin/navigatie/maak/index___navigatie-pagina-aanmaken')}
				description={tText(
					'pages/admin/navigatie/maak/index___aanmaken-van-een-navigatie-item'
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
