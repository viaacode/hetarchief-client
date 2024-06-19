import { ContentPageLabelEdit } from '@meemoo/admin-core-ui';
import React, { type FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type DefaultSeoInfo } from '@shared/types/seo';

interface ContentPageLabelsEditPageProps {
	id: string | undefined;
}

export const ContentPageLabelsEditPage: FC<DefaultSeoInfo & ContentPageLabelsEditPageProps> = ({
	url,
	id,
}) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels__create">
						<ContentPageLabelEdit contentPageLabelId={id} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	const title = id
		? tText(
				'pages/admin/content-pagina-labels/id/bewerk/index___content-pagina-label-bewerk-pagina'
		  )
		: tText(
				'pages/admin/content-pagina-labels/maak/index___content-pagina-label-aanmaak-pagina'
		  );
	const description = id
		? tText(
				'pages/admin/content-pagina-labels/id/bewerk/index___laat-de-gebruik-de-details-van-een-content-pagina-label-aanpassen'
		  )
		: tText(
				'pages/admin/content-pagina-labels/maak/index___laat-de-gebruiker-een-content-pagina-label-aanmaken'
		  );
	return (
		<>
			<SeoTags
				title={title}
				description={description}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck anyPermissions={[Permission.EDIT_CONTENT_PAGE_LABELS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
