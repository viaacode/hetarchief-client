import { FC } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { VisitorSpaceSettings } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { Loading } from '@shared/components';
import DisableServerSideRendering from '@shared/components/DisableServerSideRendering/DisableServerSideRendering';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

export const CpAdminSettingsPage: FC<DefaultSeoInfo> = ({ url }) => {
	/**
	 * Hooks
	 */
	const { tHtml, tText } = useTranslation();

	/**
	 * Data
	 */
	const user = useSelector(selectUser);

	const {
		data: visitorSpaceInfo,
		isLoading,
		refetch,
	} = useGetVisitorSpace(user?.visitorSpaceSlug || null, false, {
		enabled: !!user?.visitorSpaceSlug,
	});

	/**
	 * Render
	 */

	const renderErrorMessage = () => {
		if (!user?.visitorSpaceSlug) {
			return tHtml('pages/beheer/instellingen/index___geen-maintainer-id-gevonden');
		}
		return tHtml(
			'pages/beheer/instellingen/index___er-ging-iets-mis-bij-het-ophalen-van-de-instellingen'
		);
	};

	const renderPageContent = () => {
		return (
			<CPAdminLayout
				className="p-cp-settings"
				pageTitle={tText('pages/beheer/instellingen/index___instellingen')}
			>
				<div className="l-container">
					{visitorSpaceInfo ? (
						<VisitorSpaceSettings room={visitorSpaceInfo} refetch={refetch} />
					) : (
						<p className="u-color-neutral">{renderErrorMessage()}</p>
					)}
				</div>
			</CPAdminLayout>
		);
	};

	return isLoading ? (
		<Loading fullscreen owner="admin visitor page settings" />
	) : (
		<>
			{renderOgTags(
				tText('pages/beheer/instellingen/index___beheer-instellingen-title'),
				tText('pages/beheer/instellingen/index___beheer-instellingen-meta-omschrijving'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.UPDATE_OWN_SPACE]}>
				<DisableServerSideRendering>{renderPageContent()}</DisableServerSideRendering>
			</PermissionsCheck>
		</>
	);
};