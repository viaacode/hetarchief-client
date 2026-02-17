import { mapDcTermsFormatToSimpleType } from '@ie-objects/utils/map-dc-terms-format-to-simple-type';
import { type MaterialRequest, MaterialRequestDownloadStatus } from '@material-requests/types';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { asDate } from '@shared/utils/dates';
import { isWithinInterval } from 'date-fns';
import { noop } from 'lodash-es';

export function determineHasDownloadExpired(materialRequest: MaterialRequest): boolean {
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

export function handleDownloadMaterialRequest(materialRequest: MaterialRequest): void {
	const hasDownloadExpired = determineHasDownloadExpired(materialRequest);

	if (
		hasDownloadExpired ||
		materialRequest.downloadStatus !== MaterialRequestDownloadStatus.SUCCEEDED
	) {
		console.error(
			`The download has expired (${hasDownloadExpired}) or the download has not yet succeeded ('${materialRequest.downloadStatus}')`
		);
		return;
	}

	EventsService.triggerEvent(LogEventType.ITEM_REQUEST_DOWNLOAD_EXECUTED, window.location.href, {
		type: mapDcTermsFormatToSimpleType(materialRequest.objectDctermsFormat),
		or_id: materialRequest.maintainerId,
		pid: materialRequest.objectSchemaIdentifier,
		material_request_group_id: materialRequest.requestGroupId,
		time: materialRequest.downloadAvailableAt,
	}).then(noop);

	// TODO: trigger endpoint to get download;
}
