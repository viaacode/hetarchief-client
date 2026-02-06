import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import type { UserGroupOverviewRef } from '@admin/types';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tHtml, tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';
import clsx from 'clsx';
import React, { type FC, lazy, Suspense, useRef, useState } from 'react';

import styles from './PermissionsOverviewPage.module.scss';

const UserGroupOverview = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => ({
		default: adminCoreModule.UserGroupOverview,
	}))
);

export const PermissionsOverview: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
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
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						aria-label={tText('pages/admin/gebruikersbeheer/permissies/index___opnieuw-instellen')}
						onClick={() => {
							permissionsRef.current?.onSearch(undefined);
						}}
					/>
				)}
				<Button
					variants={['text', 'icon', 'xxs']}
					icon={<Icon name={IconNamesLight.Search} aria-hidden />}
					aria-label={tText('pages/admin/gebruikersbeheer/permissies/index___uitvoeren')}
					onClick={() => permissionsRef.current?.onSearch(search)}
				/>
			</>
		);
	};

	const renderPermissions = () => (
		<>
			<Suspense fallback={<Loading fullscreen locationId="PermissionsOverview" />}>
				<UserGroupOverview
					className="p-admin-permissions u-mb-40"
					ref={permissionsRef}
					onChangePermissions={(value: boolean) => setHasChanges(value)}
					renderSearchButtons={renderSearchButtons}
				/>
			</Suspense>
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
					label={tHtml('pages/admin/gebruikersbeheer/permissies/index___wijzigingen-opslaan')}
				/>
			</>
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('pages/admin/gebruikersbeheer/permissies/index___groepen-en-permissies')}
			>
				<AdminLayout.Actions>{hasChanges && <>{renderActionButtons()}</>}</AdminLayout.Actions>
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
			<SeoTags
				title={tText('pages/admin/gebruikersbeheer/permissies/index___groepen-en-permissies')}
				description={tText(
					'pages/admin/gebruikersbeheer/permissies/index___groepen-en-permissies-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.EDIT_PERMISSION_GROUPS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
