import { Button } from '@meemoo/react-components';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useRef } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { ReadingRoomSettings } from '@cp/components';
import { withI18n } from '@i18n/wrappers';
import { ROUTE_PARTS } from '@shared/const';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const ReadingRoomCreate: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const formRef = useRef<{ createSpace: () => void } | undefined>(undefined);

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
				<AdminLayout.Actions>
					<Button
						label={t(
							'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___annuleren'
						)}
						variants="silver"
						onClick={() =>
							router.push(
								`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}`
							)
						}
					/>
					<Button
						label={t(
							'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___opslaan'
						)}
						variants="black"
						onClick={() => {
							formRef.current?.createSpace();
						}}
					/>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className="l-container">
						<ReadingRoomSettings ref={formRef} action="create" room={emptyRoom} />
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
