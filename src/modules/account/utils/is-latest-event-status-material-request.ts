import {
	type MaterialRequest,
	type MaterialRequestEventType,
	MaterialRequestStatus,
} from '@material-requests/types';

export function isLatestEventStatus(
	materialRequest: MaterialRequest,
	status: MaterialRequestEventType
): boolean {
	return (
		materialRequest.status === MaterialRequestStatus.PENDING &&
		materialRequest.history.length > 0 &&
		materialRequest.history.at(materialRequest.history.length - 1)?.messageType === status
	);
}
