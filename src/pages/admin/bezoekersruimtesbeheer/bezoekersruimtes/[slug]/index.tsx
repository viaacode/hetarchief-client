import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomSettings } from '@cp/components';
import { withI18n } from '@i18n/wrappers';
import { useGetVisitorSpace } from '@reading-room/hooks/get-reading-room';
import { Loading } from '@shared/components';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const ReadingRoomEdit: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { slug } = router.query;

	const { data: readingRoomInfo, isLoading, refetch } = useGetVisitorSpace(slug as string);

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t(
							'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
						)
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen-meta-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout
				pageTitle={t(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
				)}
			>
				<AdminLayout.Content>
					<div className="l-container">
						{isLoading && <Loading />}
						{readingRoomInfo && (
							<ReadingRoomSettings room={readingRoomInfo} refetch={refetch} />
						)}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(ReadingRoomEdit, Permission.UPDATE_ALL_SPACES));
