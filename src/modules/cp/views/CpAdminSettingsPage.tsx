import { type FC } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { VisitorSpaceSettings } from '@cp/components/VisitorSpaceSettings';
import { CPAdminLayout } from '@cp/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tHtml, tText } from '@shared/helpers/translate';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';

export const CpAdminSettingsPage: FC<DefaultSeoInfo> = ({ url }) => {
	/**
	 * Hooks
	 */

	/**
	 * Data
	 */
	const user = useSelector(selectUser);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (!user?.visitorSpaceSlug) {
			return tHtml('pages/beheer/instellingen/index___geen-maintainer-id-gevonden');
		}
		return (
			<CPAdminLayout
				className="p-cp-settings"
				pageTitle={tText('pages/beheer/instellingen/index___instellingen')}
			>
				<VisitorSpaceSettings action="edit" visitorSpaceSlug={user?.visitorSpaceSlug} />
			</CPAdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('pages/beheer/instellingen/index___beheer-instellingen-title')}
				description={tText(
					'pages/beheer/instellingen/index___beheer-instellingen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.UPDATE_OWN_SPACE]}>
				<NoServerSideRendering>{renderPageContent()}</NoServerSideRendering>
			</PermissionsCheck>
		</>
	);
};
