import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { VisitorSpaceSettings } from '@cp/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

export const AdminVisitorSpaceCreate: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const emptyRoom = {
		id: '',
		color: null,
		image: null,
		description: null,
		serviceDescription: null,
		logo: '',
		name: '',
		slug: '',
	};

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container">
						<VisitorSpaceSettings action="create" room={emptyRoom} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
				),
				tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte-meta-omschrijving'
				),
				url
			)}
			<PermissionsCheck allPermissions={[Permission.UPDATE_ALL_SPACES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
