import { ContentPageEdit } from '@meemoo/admin-core-ui';
import { type Avo } from '@viaa/avo2-types';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

interface ContentPageEditPageProps {
	id: string | undefined;
}

export const ContentPageEditPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined } & ContentPageEditPageProps
> = ({ url, commonUser, id }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout bottomPadding={false} className="p-admin-content-page-create">
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit id={id} commonUser={commonUser as Avo.User.CommonUser} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	const title = id
		? tText('pages/admin/content/id/bewerk/index___content-pagina-bewerkenx')
		: tText('pages/admin/content/maak/index___content-pagina-aanmaken');
	const description = id
		? tText('pages/admin/content/id/bewerk/index___bewerk-pagina-van-een-content-pagina')
		: tText('pages/admin/content/maak/index___maak-een-nieuwe-content-pagina-adhv-blokken');
	return (
		<>
			<SeoTags
				title={title}
				description={description}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck
				anyPermissions={[
					Permission.CREATE_CONTENT_PAGES,
					Permission.EDIT_ANY_CONTENT_PAGES,
				]}
			>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
