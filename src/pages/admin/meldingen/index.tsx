import { AlertsOverview } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC, ReactNode } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { Blade } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminAlertsOverview: FC<DefaultSeoInfo> = ({ url }) => {
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
						'u-px-32 u-py-24'
						// styles['c-translations-overview__blade-footer']
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
				// className={styles['c-translations-overview__blade']}
				footer={renderFooter()}
				isOpen={isOpen}
				onClose={onClose}
				renderTitle={(props) => <h3 {...props}>{title}</h3>}
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
						<AlertsOverview className="p-admin-alerts" renderPopup={renderPopup} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/meldingen/index___meldingen'),
				tText('pages/admin/meldingen/index___meldingen-meta-tag'),
				url
			)}

			{/* TODO: permission */}
			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MAINTENANCE_ALERTS]}>
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

export default withAuth(withAdminCoreConfig(AdminAlertsOverview as ComponentType));
