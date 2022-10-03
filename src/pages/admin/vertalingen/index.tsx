import { TranslationsOverview } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import getConfig from 'next/config';
import React, { FC, useRef } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { TranslationsOverviewRef } from '@admin/types';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';

const { publicRuntimeConfig } = getConfig();

const AdminTranslationsOverview: FC = () => {
	const { tHtml, tText } = useTranslation();

	// Access child functions
	const translationsRef = useRef<TranslationsOverviewRef>();

	return (
		<>
			{renderOgTags(
				tText('pages/admin/vertalingen/index___vertalingen'),
				tText('pages/admin/vertalingen/index___vertalingen'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout pageTitle={tHtml('pages/admin/vertalingen/index___vertalingen')}>
				<AdminLayout.Actions>
					<Button
						onClick={() => translationsRef.current?.onSave()}
						label={tHtml('pages/admin/vertalingen/index___wijzigingen-opslaan')}
					/>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-vertalingen">
						<TranslationsOverview ref={translationsRef} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(AdminTranslationsOverview),
		Permission.EDIT_TRANSLATIONS
	)
);
