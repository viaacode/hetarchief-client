import type { MaterialRequestReuseForm } from '@material-requests/types';
import {
	formatDurationHoursMinutesSeconds,
	formatDurationMinutesSeconds,
} from '@meemoo/react-components';
import { isNil } from 'lodash-es';

export function formatCuePointsMaterialRequest(
	reuseForm: MaterialRequestReuseForm | undefined
): string {
	if (!reuseForm) {
		return '';
	}

	// If duration is less than an hour, we format the date as mm:ss, otherwise wwe format as hh:mm:ss
	const formatTimeStamp = (value: number | undefined) => {
		if (isNil(value)) return '';

		if (value < 60 * 60) {
			return formatDurationMinutesSeconds(value);
		}
		return formatDurationHoursMinutesSeconds(value);
	};

	return `${formatTimeStamp(reuseForm.startTime)} - ${formatTimeStamp(reuseForm.endTime)}`;
}
