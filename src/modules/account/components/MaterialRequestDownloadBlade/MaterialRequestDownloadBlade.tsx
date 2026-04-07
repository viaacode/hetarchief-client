import { Blade } from '@shared/components/Blade/Blade';
import { tHtml, tText } from '@shared/helpers/translate';
import React, { type FC } from 'react';

interface MaterialRequestDownloadBladeProps {
	location: string;
	downloadUrl: string | null;
	onClose: () => void;
}

export const MaterialRequestDownloadBlade: FC<MaterialRequestDownloadBladeProps> = ({
	location,
	downloadUrl,
	onClose,
}) => (
	<Blade
		id={`${location}__download-blade`}
		isOpen={!!downloadUrl}
		title={tText(
			'modules/account/components/material-request-download-blade/material-request-download-blade___download-is-klaar'
		)}
		ariaLabel={tText(
			'modules/account/components/material-request-download-blade/material-request-download-blade___download-is-klaar-blade-aria-label'
		)}
		onClose={onClose}
		footerButtons={[
			{
				label: tText(
					'modules/account/components/material-request-download-blade/material-request-download-blade___download'
				),
				mobileLabel: tText(
					'modules/account/components/material-request-download-blade/material-request-download-blade___download-mobiel'
				),
				type: 'primary',
				onClick: () => {
					setTimeout(() => {
						onClose();
					}, 100);
				},
				href: downloadUrl || undefined,
			},
		]}
	>
		{tHtml(
			'modules/account/components/material-request-download-blade/material-request-download-blade___je-kan-je-download-nu-downloaden'
		)}
	</Blade>
);
