import { UserGroupOverview } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSidePropsResult } from 'next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC, useRef, useState } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { UserGroupOverviewRef } from '@admin/types';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { Icon } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import styles from './index.module.scss';

const { publicRuntimeConfig } = getConfig();

const PermissionsOverview: FC<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();

	// Access child functions
	const permissionsRef = useRef<UserGroupOverviewRef>();

	const [hasChanges, setHasChanges] = useState<boolean>(false);

	// Render
	const renderSearchButtons = (search?: string) => {
		return (
			<>
				{search && (
					<Button
						variants={['text', 'icon', 'xxs']}
						icon={<Icon name="times" aria-hidden />}
						aria-label={tText(
							'pages/admin/gebruikersbeheer/permissies/index___opnieuw-instellen'
						)}
						onClick={() => {
							permissionsRef.current?.onSearch(undefined);
						}}
					/>
				)}
				<Button
					variants={['text', 'icon', 'xxs']}
					icon={<Icon name="search" aria-hidden />}
					aria-label={tText('pages/admin/gebruikersbeheer/permissies/index___uitvoeren')}
					onClick={() => permissionsRef.current?.onSearch(search)}
				/>
			</>
		);
	};

	const renderPermissions = () => (
		<>
			<UserGroupOverview
				className="p-admin-permissions u-mb-40"
				ref={permissionsRef}
				onChangePermissions={(value) => setHasChanges(value)}
				renderSearchButtons={renderSearchButtons}
			/>
		</>
	);

	const renderActionButtons = () => {
		return (
			<>
				<Button
					onClick={() => permissionsRef.current?.onCancel()}
					label={tHtml('pages/admin/gebruikersbeheer/permissies/index___annuleren')}
				/>
				<Button
					onClick={() => permissionsRef.current?.onSave()}
					label={tHtml(
						'pages/admin/gebruikersbeheer/permissies/index___wijzigingen-opslaan'
					)}
				/>
			</>
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tHtml(
					'pages/admin/gebruikersbeheer/permissies/index___groepen-en-permissies'
				)}
			>
				<AdminLayout.Actions>
					{hasChanges && <>{renderActionButtons()}</>}
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className={clsx('l-container', styles['p-permissions-page'])}>
						{renderPermissions()}
					</div>
					<div className={clsx('l-container', styles['p-action-buttons'])}>
						{hasChanges && renderActionButtons()}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/gebruikersbeheer/permissies/index___groepen-en-permissies'),
				tText(
					'pages/admin/gebruikersbeheer/permissies/index___groepen-en-permissies-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.EDIT_PERMISSION_GROUPS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return {
		props: {
			url: publicRuntimeConfig.CLIENT_URL + (context?.resolvedUrl || ''),
			...(await withI18n()).props,
		},
	};
}

export default withAuth(withAdminCoreConfig(PermissionsOverview as ComponentType));
