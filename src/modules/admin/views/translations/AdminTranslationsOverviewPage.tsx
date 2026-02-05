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

import styles from './AdminTranslationsOverviewPage.module.scss';

const TranslationsOverview = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => {
		return {
			default: adminCoreModule.TranslationsOverview,
		};
	})
);

export const AdminTranslationsOverview: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
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
		const getFooterButtons = (): BladeFooterProps => {
			return [
				{
					label: tText('pages/admin/vertalingen/index___bewaar-wijzigingen'),
					type: 'primary',
					onClick: onSave,
				},
				{
					label: tText('pages/admin/vertalingen/index___annuleer'),
					type: 'secondary',
					onClick: onClose,
				},
			];
		};

		return (
			<Blade
				className={styles['c-translations-overview__blade']}
				footerButtons={getFooterButtons()}
				isOpen={isOpen}
				onClose={onClose}
				title={title}
				id="translations-blade"
			>
				<div className={styles['c-translations-overview__blade-body']}>{body}</div>
			</Blade>
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout pageTitle={tText('pages/admin/vertalingen/index___vertalingen')}>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-vertalingen">
						<Suspense fallback={<Loading fullscreen owner="AdminTranslationsOverviewPage" />}>
							<TranslationsOverview
								className={styles['c-translations-overview']}
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
				title={tText('pages/admin/vertalingen/index___vertalingen')}
				description={tText('pages/admin/vertalingen/index___vertalingen')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.EDIT_TRANSLATIONS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
