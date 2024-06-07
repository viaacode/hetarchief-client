import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { VisitorSpaceSettings } from '@cp/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

export const AdminVisitorSpaceCreate: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<VisitorSpaceSettings action="create" visitorSpaceSlug={null} />
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
				)}
				description={tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck allPermissions={[Permission.UPDATE_ALL_SPACES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
