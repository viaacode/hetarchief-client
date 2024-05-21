import { UserOverview } from '@meemoo/admin-core-ui';
import { Avo } from '@viaa/avo2-types';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import { formatDistanceTodayWithoutTime } from '@shared/utils';

export const UsersOverviewPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined }
> = ({ url, commonUser }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}
			>
				<AdminLayout.Content>
					<div className="l-container">
						<UserOverview
							customFormatDate={formatDistanceTodayWithoutTime}
							commonUser={commonUser as Avo.User.CommonUser}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers'),
				tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers-omschrijving'),
				url
			)}
			<PermissionsCheck allPermissions={[Permission.VIEW_USERS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
