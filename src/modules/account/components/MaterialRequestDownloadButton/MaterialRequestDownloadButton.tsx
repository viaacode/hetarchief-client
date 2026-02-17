import {
	determineHasDownloadExpired,
	handleDownloadMaterialRequest,
} from '@account/utils/handle-download-material-request';
import { type MaterialRequest, MaterialRequestStatus } from '@material-requests/types';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import type { FC } from 'react';

interface MaterialRequestStatusPillProps {
	materialRequest: MaterialRequest;
	showLabel?: boolean;
}

const MaterialRequestDownloadButton: FC<MaterialRequestStatusPillProps> = ({ materialRequest }) => {
	if (
		materialRequest.status !== MaterialRequestStatus.APPROVED ||
		!materialRequest.downloadUrl ||
		determineHasDownloadExpired(materialRequest)
	) {
		return null;
	}

	return (
		<Button
			icon={<Icon name={IconNamesLight.Download} aria-hidden />}
			variants={['silver', 'sm']}
			tooltipText={tText(
				'modules/account/components/material-request-download-button/material-request-download-button___download-materiaal'
			)}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				handleDownloadMaterialRequest(materialRequest);
			}}
		/>
	);
};

export default MaterialRequestDownloadButton;
