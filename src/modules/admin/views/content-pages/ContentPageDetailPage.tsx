import { type Avo } from '@viaa/avo2-types';
import React, { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { type DefaultSeoInfo } from '@shared/types/seo';

('use client');
// https://github.com/vercel/next.js/issues/47232

const ContentPageDetail = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageDetail,
	}))
);

interface ContentPageDetailPageProps {
	id: string;
}

export const ContentPageDetailPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined } & ContentPageDetailPageProps
> = ({ url, commonUser, id }) => {
	const renderPageContent = () => {
		return (
			<AdminLayout className="p-admin-content-page-detail">
				<AdminLayout.Content>
					<Suspense fallback={<Loading fullscreen owner="ContentPageDetailPage" />}>
						<ContentPageDetail id={id} commonUser={commonUser as Avo.User.CommonUser} />
					</Suspense>
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
