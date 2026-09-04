import {
	MaterialRequestDurationType,
	type MaterialRequestReuseForm,
} from '@material-requests/types';
import { formatDuration } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { isNil } from 'es-toolkit/compat';

// If duration is less than an hour, we format the date as mm:ss, otherwise wwe format as hh:mm:ss
const formatTimeStamp = (value: number | undefined) => {
	if (isNil(value)) {
		return '';
	}

	return formatDuration(value, { includeHours: 'auto' });
};

export function formatCuePointsMaterialRequest(
	reuseForm: MaterialRequestReuseForm | undefined
): string {
	if (!reuseForm) {
		return '';
	}

	if (reuseForm?.durationType === MaterialRequestDurationType.FULL) {
		return tText('modules/account/views/account-my-application-list___volledig-bestand');
	}

	return `${formatTimeStamp(reuseForm.startTime)} - ${formatTimeStamp(reuseForm.endTime)}`;
}
