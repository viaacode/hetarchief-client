import { MaintenanceAlertsOverview } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Blade } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

export const AdminMaintenanceAlertsOverview: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPopup = ({
		title,
		body,
		isOpen,
		onSave,
		onClose,
	}: {
		title: ReactNode;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => {
		const renderFooter = () => {
			return (
				<div className={clsx('u-px-32 u-py-24')}>
					<Button
						variants={['block', 'black']}
						onClick={onSave}
						label={tText('pages/admin/vertalingen/index___bewaar-wijzigingen')}
					/>

					<Button
						variants={['block', 'text']}
						onClick={onClose}
						label={tText('pages/admin/vertalingen/index___annuleer')}
					/>
				</div>
			);
		};

		return (
			<Blade
				footer={renderFooter()}
				isOpen={isOpen}
				onClose={onClose}
				renderTitle={(props: any) => <h2 {...props}>{title}</h2>}
				id="alerts-blade"
			>
				<div className="u-px-32">{body}</div>
			</Blade>
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container u-mb-40">
						<MaintenanceAlertsOverview
							className="p-admin-alerts"
							renderPopup={renderPopup}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('pages/admin/meldingen/index___meldingen')}
				description={tText('pages/admin/meldingen/index___meldingen-meta-tag')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MAINTENANCE_ALERTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
