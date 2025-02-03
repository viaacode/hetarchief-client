import type { Avo } from '@viaa/avo2-types';
import React, { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { formatDistanceTodayWithoutTime } from '@shared/utils/dates';

const UserOverview = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.UserOverview,
	}))
);

export const UsersOverviewPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined }
> = ({ url, commonUser }) => {
	const renderPageContent = () => {
		return (
			<AdminLayout pageTitle={tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}>
				<AdminLayout.Content>
					<div className="l-container">
						<Suspense fallback={<Loading fullscreen owner="UsersOverviewPage" />}>
							<UserOverview
								customFormatDate={formatDistanceTodayWithoutTime}
								commonUser={commonUser as Avo.User.CommonUser}
							/>
						</Suspense>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}
				description={tText(
					'pages/admin/gebruikersbeheer/gebruikers/index___gebruikers-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck allPermissions={[Permission.VIEW_USERS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
