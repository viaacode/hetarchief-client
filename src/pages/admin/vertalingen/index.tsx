import { TranslationsOverview } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC, useRef } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { TranslationsOverviewRef } from '@admin/types';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminTranslationsOverview: FC<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();

	// Access child functions
	const translationsRef = useRef<TranslationsOverviewRef>();

	const renderPageContent = () => {
		return (
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
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/vertalingen/index___vertalingen'),
				tText('pages/admin/vertalingen/index___vertalingen'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.EDIT_TRANSLATIONS]}>
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

export default withAuth(withAdminCoreConfig(AdminTranslationsOverview as ComponentType));
