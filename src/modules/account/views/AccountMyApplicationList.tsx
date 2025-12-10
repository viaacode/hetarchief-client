import { Permission } from '@account/const';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorLayout } from '@visitor-layout/index';
import type { FC } from 'react';

export const AccountMyApplicationList: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	return (
		<VisitorLayout>
			<SeoTags
				title={tText('Aanvraaglijst')}
				description={tText('Aanvraaglijst meta omschrijving')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.CREATE_MATERIAL_REQUESTS]}>
				<p>TODO</p>
			</PermissionsCheck>
		</VisitorLayout>
	);
};
