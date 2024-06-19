import { ContentPageLabelOverview } from '@meemoo/admin-core-ui';
import { type FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type DefaultSeoInfo } from '@shared/types/seo';

export const ContentPageLabelsOverviewPage: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels">
						<ContentPageLabelOverview />
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
