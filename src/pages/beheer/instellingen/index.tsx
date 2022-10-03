import { NextPage } from 'next';
import getConfig from 'next/config';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

const { publicRuntimeConfig } = getConfig();

const CPSettingsPage: NextPage = () => {
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

	return isLoading ? (
		<Loading fullscreen />
	) : (
		<>
			{renderOgTags(
				tText('pages/beheer/instellingen/index___beheer-instellingen-title'),
				tText('pages/beheer/instellingen/index___beheer-instellingen-meta-omschrijving'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<CPAdminLayout
				className="p-cp-settings"
				pageTitle={tHtml('pages/beheer/instellingen/index___instellingen')}
			>
				<div className="l-container">
					{visitorSpaceInfo ? (
						<VisitorSpaceSettings room={visitorSpaceInfo} refetch={refetch} />
					) : (
						<p className="u-color-neutral">{renderErrorMessage()}</p>
					)}
				</div>
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(CPSettingsPage, Permission.UPDATE_OWN_SPACE));
