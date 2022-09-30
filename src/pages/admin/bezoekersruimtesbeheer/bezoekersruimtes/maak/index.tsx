import { Button } from '@meemoo/react-components';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { FC, useRef } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import { withI18n } from '@i18n/wrappers';
import { ROUTE_PARTS } from '@shared/const';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';

const { publicRuntimeConfig } = getConfig();

const VisitorSpaceCreate: FC = () => {
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

	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte'
				),
				tText(
					'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/maak/index___nieuwe-bezoekersruimte-meta-omschrijving'
				),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout
				pageTitle={tHtml(
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
		</>
	);
};

export const getServerSideProps = withI18n();

// TODO: permission
export default withAuth(
	withAllRequiredPermissions(VisitorSpaceCreate, Permission.UPDATE_ALL_SPACES)
);
