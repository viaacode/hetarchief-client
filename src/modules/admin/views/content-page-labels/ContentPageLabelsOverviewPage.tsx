import { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { type DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelOverview = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageLabelOverview,
	}))
);

export const ContentPageLabelsOverviewPage: FC<DefaultSeoInfo> = ({ url }) => {
	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels">
						<Suspense
							fallback={<Loading fullscreen owner="ContentPageLabelsOverviewPage" />}
						>
							<ContentPageLabelOverview />
						</Suspense>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('pages/admin/content-pagina-labels/index___content-pagina-labels')}
				description={tText(
					'pages/admin/content-pagina-labels/index___overzicht-van-alle-content-pagina-labels-die-beschikbaar-zijn-binnen-het-archief'
				)}
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
