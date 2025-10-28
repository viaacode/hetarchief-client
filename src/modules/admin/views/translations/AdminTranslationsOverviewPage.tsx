import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC, lazy, type ReactNode, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Blade } from '@shared/components/Blade/Blade';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';

import styles from './AdminTranslationsOverviewPage.module.scss';

const TranslationsOverview = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => {
		return {
			default: adminCoreModule.TranslationsOverview,
		};
	})
);

export const AdminTranslationsOverview: FC<DefaultSeoInfo> = ({ url }) => {
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
				<div
					className={clsx(
						'u-px-32 u-px-16-md u-py-24',
						styles['c-translations-overview__blade-footer']
					)}
				>
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
				className={styles['c-translations-overview__blade']}
				footer={renderFooter()}
				isOpen={isOpen}
				onClose={onClose}
				renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => <h2 {...props}>{title}</h2>}
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
			/>

			<PermissionsCheck allPermissions={[Permission.EDIT_TRANSLATIONS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
