import MaterialRequestDownloadBlade from '@account/components/MaterialRequestDownloadBlade/MaterialRequestDownloadBlade';
import {
	determineHasDownloadExpired,
	handleDownloadMaterialRequest,
} from '@account/utils/handle-download-material-request';
import {
	type MaterialRequest,
	MaterialRequestDownloadStatus,
	MaterialRequestStatus,
} from '@material-requests/types';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { type FC, useState } from 'react';

interface MaterialRequestStatusPillProps {
	materialRequest: MaterialRequest;
	showLabel?: boolean;
}

const MaterialRequestDownloadButton: FC<MaterialRequestStatusPillProps> = ({ materialRequest }) => {
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	if (
		materialRequest.status !== MaterialRequestStatus.APPROVED ||
		materialRequest.downloadStatus !== MaterialRequestDownloadStatus.SUCCEEDED ||
		determineHasDownloadExpired(materialRequest)
	) {
		return null;
	}

	return (
		<>
			<Button
				id={`material-request-download-button__${materialRequest.id}`}
				icon={<Icon name={IconNamesLight.Download} aria-hidden />}
				variants={['silver', 'sm']}
				tooltipText={tText(
					'modules/account/components/material-request-download-button/material-request-download-button___download-materiaal'
				)}
				onClick={(event) => {
					event.preventDefault();
					event.stopPropagation();
					handleDownloadMaterialRequest(materialRequest).then(setDownloadUrl);
				}}
			/>
			<MaterialRequestDownloadBlade
				location="material-request-download-button"
				downloadUrl={downloadUrl}
				onClose={() => setDownloadUrl(null)}
			/>
		</>
	);
};

export default MaterialRequestDownloadButton;
