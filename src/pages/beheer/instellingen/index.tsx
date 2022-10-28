import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { Loading } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

const CPSettingsPage: NextPage<DefaultSeoInfo> = ({ url }) => {
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
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(CPSettingsPage as ComponentType);
