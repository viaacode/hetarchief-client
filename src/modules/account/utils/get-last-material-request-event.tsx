import type { MaterialRequest, MaterialRequestEvent } from '@material-requests/types';

export const getLastEvent = (
	materialRequest: MaterialRequest | undefined
): MaterialRequestEvent | undefined => {
	return materialRequest && materialRequest.history.length > 0
		? materialRequest.history.at(materialRequest.history.length - 1)
		: undefined;
};
