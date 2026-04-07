import { type MaterialRequest, MaterialRequestStatus } from '@material-requests/types';
import { determineHasDownloadExpired } from './handle-download-material-request';

export const isMaterialRequestClosed = (materialRequest: MaterialRequest | undefined): boolean => {
	if (
		!materialRequest ||
		materialRequest.status === MaterialRequestStatus.CANCELLED ||
		materialRequest.status === MaterialRequestStatus.DENIED
	) {
		// No request or request was cancelled or denied => request is closed
		return true;
	}

	if (materialRequest.status === MaterialRequestStatus.APPROVED) {
		// Request is approved but download has expired => request is closed
		return determineHasDownloadExpired(materialRequest);
	}

	// Request is pending or download is available => still an open request
	return false;
};
