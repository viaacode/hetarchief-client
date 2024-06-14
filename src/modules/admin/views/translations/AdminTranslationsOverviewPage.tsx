import { TranslationsOverview } from '@meemoo/admin-core-ui';
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

import styles from './AdminTranslationsOverviewPage.module.scss';

export const AdminTranslationsOverview: FC<DefaultSeoInfo> = ({ url }) => {
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
				<div
					className={clsx(
						'u-px-32 u-py-24',
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
				renderTitle={(props: any) => <h2 {...props}>{title}</h2>}
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
						<TranslationsOverview
							className={styles['c-translations-overview']}
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
