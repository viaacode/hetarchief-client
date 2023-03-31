import { Button } from '@meemoo/react-components';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC, useRef } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { ROUTE_PARTS } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const VisitorSpaceCreate: FC<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
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

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
				)}
			>
				<AdminLayout.Actions>
					<Button
						label={tHtml(
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
						label={tHtml(
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
						<VisitorSpaceSettings ref={formRef} action="create" room={emptyRoom} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
				),
				tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte-meta-omschrijving'
				),
				url
			)}
			<PermissionsCheck allPermissions={[Permission.UPDATE_ALL_SPACES]}>
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

export default withAuth(VisitorSpaceCreate as ComponentType, true);
