import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomSettings } from '@cp/components';
import { withI18n } from '@i18n/wrappers';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const ReadingRoomCreate: FC = () => {
	const { t } = useTranslation();

	const emptyRoom = {
		id: '',
		color: null,
		image: null,
		description: null,
		serviceDescription: null,
		logo: '',
		name: '',
		slug: '',
	};

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t(
							'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
						)
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte-meta-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout
				pageTitle={t(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
				)}
			>
				<AdminLayout.Content>
					<div className="l-container">
						<ReadingRoomSettings action="create" room={emptyRoom} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

// TODO: permission
export default withAuth(
	withAllRequiredPermissions(ReadingRoomCreate, Permission.UPDATE_ALL_SPACES)
);
