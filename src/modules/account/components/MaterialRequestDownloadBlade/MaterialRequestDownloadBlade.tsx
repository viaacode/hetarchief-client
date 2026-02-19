import { Blade } from '@shared/components/Blade/Blade';
import { tHtml, tText } from '@shared/helpers/translate';
import React, { type FC } from 'react';

interface MaterialRequestDownloadBladeProps {
	location: string;
	downloadUrl: string | null;
	onClose: () => void;
}

const MaterialRequestDownloadBlade: FC<MaterialRequestDownloadBladeProps> = ({
	location,
	downloadUrl,
	onClose,
}) => (
	<Blade
		id={`${location}__download-blade`}
		isOpen={!!downloadUrl}
		title={tText('Download is klaar')}
		ariaLabel={tText('Download is klaar blade [ARIA_LABEL]')}
		onClose={onClose}
		footerButtons={[
			{
				label: tText('Download'),
				mobileLabel: tText('Download mobiel'),
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
		{tHtml('Je kan je download nu downloaden')}
	</Blade>
);

export default MaterialRequestDownloadBlade;
