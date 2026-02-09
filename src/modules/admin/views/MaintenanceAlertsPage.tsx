import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';
import React, { type FC, lazy, type ReactNode, Suspense } from 'react';

const AdminMaintenanceAlertsOverview = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => ({
		default: adminCoreModule.MaintenanceAlertsOverview,
	}))
);

export const AdminMaintenanceAlertsOverviewPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const getFooterButtons = (onSave: () => void, onClose: () => void): BladeFooterProps => {
		return [
			{
				label: tText('pages/admin/vertalingen/index___bewaar-wijzigingen'),
				mobileLabel: tText(
					'modules/admin/views/maintenance-alerts-page___bewaar-wijzigingen-mobiel'
				),
				type: 'primary',
				onClick: onSave,
			},
			{
				label: tText('pages/admin/vertalingen/index___annuleer'),
				mobileLabel: tText('modules/admin/views/maintenance-alerts-page___annuleer-mobiel'),
				type: 'secondary',
				onClick: onClose,
			},
		];
	};

	const renderPopup = ({
		title,
		body,
		isOpen,
		onSave,
		onClose,
	}: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => {
		return (
			<Blade
				footerButtons={getFooterButtons(onSave, onClose)}
				isOpen={isOpen}
				onClose={onClose}
				title={title}
				id="alerts-blade"
			>
				{body}
			</Blade>
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container u-mb-40">
						<Suspense
							fallback={<Loading fullscreen locationId="AdminMaintenanceAlertsOverviewPage" />}
						>
							<AdminMaintenanceAlertsOverview
								className="p-admin-alerts"
								renderPopup={renderPopup}
							/>
						</Suspense>
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
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MAINTENANCE_ALERTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
