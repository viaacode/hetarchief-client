'use client';
// https://github.com/vercel/next.js/issues/47232

import { ContentPageDetail } from '@meemoo/admin-core-ui';
import { type Avo } from '@viaa/avo2-types';
import React, { type FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type DefaultSeoInfo } from '@shared/types/seo';

interface ContentPageDetailPageProps {
	id: string;
}

export const ContentPageDetailPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined } & ContentPageDetailPageProps
> = ({ url, commonUser, id }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout className="p-admin-content-page-detail">
				<AdminLayout.Content>
					<ContentPageDetail id={id} commonUser={commonUser as Avo.User.CommonUser} />
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText('pages/admin/content/id/index___content-pagina-detail')}
				description={tText(
					'pages/admin/content/id/index___detail-pagina-van-een-content-pagina'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck
				anyPermissions={[
					Permission.EDIT_ANY_CONTENT_PAGES,
					Permission.EDIT_OWN_CONTENT_PAGES,
				]}
			>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
