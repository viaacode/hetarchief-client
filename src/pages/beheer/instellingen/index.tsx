import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomSettings } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { useGetVisitorSpace } from '@reading-room/hooks/get-visitor-space';
import { Loading } from '@shared/components';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const CPSettingsPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	/**
	 * Data
	 */
	const user = useSelector(selectUser);

	const {
		data: visitorSpaceInfo,
		isLoading,
		refetch,
	} = useGetVisitorSpace(user?.visitorSpaceSlug || null, { enabled: !!user?.visitorSpaceSlug });

	/**
	 * Render
	 */

	const renderErrorMessage = () => {
		if (!user?.visitorSpaceSlug) {
			return t('pages/beheer/instellingen/index___geen-maintainer-id-gevonden');
		}
		return t(
			'pages/beheer/instellingen/index___er-ging-iets-mis-bij-het-ophalen-van-de-instellingen'
		);
	};

	return isLoading ? (
		<Loading fullscreen />
	) : (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/beheer/instellingen/index___beheer-instellingen-title')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/beheer/instellingen/index___beheer-instellingen-meta-omschrijving'
					)}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-settings"
				pageTitle={t('pages/beheer/instellingen/index___instellingen')}
			>
				<div className="l-container">
					{visitorSpaceInfo ? (
						<ReadingRoomSettings room={visitorSpaceInfo} refetch={refetch} />
					) : (
						<p className="u-color-neutral">{renderErrorMessage()}</p>
					)}
				</div>
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(CPSettingsPage, Permission.UPDATE_OWN_SPACE));
