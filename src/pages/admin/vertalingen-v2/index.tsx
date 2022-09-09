import { TranslationsOverviewV2 } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Head from 'next/head';
import React, { FC, ReactNode } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { Blade } from '@shared/components';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle } from '@shared/utils';

import styles from './TranslationsOverviewV2.module.scss';

const AdminTranslationsOverviewV2: FC = () => {
	const { t, tText } = useTranslation();

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
						label={tText('Bewaar wijzigingen')}
					/>

					<Button
						variants={['block', 'text']}
						onClick={onClose}
						label={tText('Annuleer')}
					/>
				</div>
			);
		};

		return (
			<Blade
				isOpen={isOpen}
				onClose={onClose}
				title={title}
				footer={renderFooter()}
				className={styles['c-translations-overview__blade']}
			>
				<div className={styles['c-translations-overview__blade-body']}>{body}</div>
			</Blade>
		);
	};

	return (
		<>
			<Head>
				<title>
					{createPageTitle(tText('pages/admin/vertalingen/index___vertalingen'))}
				</title>
				<meta
					name="description"
					content={tText('pages/admin/vertalingen/index___vertalingen')}
				/>
			</Head>
			<AdminLayout pageTitle={t('pages/admin/vertalingen/index___vertalingen')}>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-vertalingen">
						<TranslationsOverviewV2
							className={styles['c-translations-overview']}
							renderPopup={renderPopup}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(AdminTranslationsOverviewV2),
		Permission.EDIT_TRANSLATIONS
	)
);
