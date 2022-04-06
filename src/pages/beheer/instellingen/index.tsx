import { Box, Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomImageForm, ReadingRooomSettings, RichTextForm } from '@cp/components';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { ReadingRoomService } from '@reading-room/services';
import { UpdateReadingRoomSettings } from '@reading-room/services/reading-room/reading-room.service.types';
import { Loading } from '@shared/components';
import { toastService } from '@shared/services/toast-service';
import { createPageTitle } from '@shared/utils';

const CPSettingsPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	/**
	 * Data
	 */
	const { data: readingRoomInfo, isLoading, refetch } = useGetReadingRoom('OR-154dn75');

	/**
	 * Render
	 */

	return isLoading ? (
		<Loading />
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
				contentTitle={t('pages/beheer/instellingen/index___instellingen')}
			>
				<div className="l-container">
					{readingRoomInfo && (
						<ReadingRooomSettings room={readingRoomInfo} refetch={refetch} />
					)}
				</div>
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(CPSettingsPage);
