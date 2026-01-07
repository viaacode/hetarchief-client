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

	const formatTimeStamp = (value: number | undefined) => {
		if (isNil(value)) return '';

		if (value < 60 * 60) {
			return formatDurationMinutesSeconds(value);
		}
		return formatDurationHoursMinutesSeconds(value);
	};

	return `${formatTimeStamp(reuseForm.startTime)} - ${formatTimeStamp(reuseForm.endTime)}`;
}
