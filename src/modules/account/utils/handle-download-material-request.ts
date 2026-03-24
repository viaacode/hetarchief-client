import { MaterialRequestsService } from '@material-requests/services';
import { type MaterialRequest, MaterialRequestDownloadStatus } from '@material-requests/types';
import { asDate } from '@shared/utils/dates';
import { isWithinInterval } from 'date-fns';

export function determineHasDownloadExpired(materialRequest: MaterialRequest): boolean {
	if (materialRequest?.downloadStatus === MaterialRequestDownloadStatus.EXPIRED) {
		return true;
	}

	const downloadAvailableAt = asDate(materialRequest?.downloadAvailableAt);
	const downloadExpiresAt = asDate(materialRequest?.downloadExpiresAt);

	return (
		!!downloadAvailableAt &&
		!!downloadExpiresAt &&
		!isWithinInterval(Date.now(), {
			start: downloadAvailableAt,
			end: downloadExpiresAt,
		})
	);
}

export async function handleDownloadMaterialRequest(
	materialRequest: MaterialRequest
): Promise<string | null> {
	const hasDownloadExpired = determineHasDownloadExpired(materialRequest);

	if (
		hasDownloadExpired ||
		materialRequest.downloadStatus !== MaterialRequestDownloadStatus.SUCCEEDED
	) {
		console.error(
			`The download has expired (${hasDownloadExpired}) or the download has not yet succeeded ('${materialRequest.downloadStatus}')`
		);
		return null;
	}

	try {
		const downloadUrl = await MaterialRequestsService.handleDownload(materialRequest.id);
		const win = window.open(downloadUrl, '_blank');
		if (!win) {
			return downloadUrl;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
