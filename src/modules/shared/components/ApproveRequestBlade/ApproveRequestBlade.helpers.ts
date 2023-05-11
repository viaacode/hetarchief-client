import {
	differenceInMinutes,
	isAfter,
	isBefore,
	isSameDay,
	roundToNearestMinutes,
	subMinutes,
} from 'date-fns';
import addMinutes from 'date-fns/addMinutes';

/**
 * Determines if we should set the end date of an visit request when the user change the start date
 *
 * @param newAccessFromDate newly entered date for the accessFrom field modified by the user
 * @param currentAccessToDate existing accessTo field value
 * @return the date that the accessTo field should be changed to, or null if it shouldn't be changed
 */
export function getAccessToDate(newAccessFromDate: Date, currentAccessToDate: Date): Date | null {
	const MINIMUM_VISIT_DURATION = 60; // minutes
	const sixPm = new Date(
		newAccessFromDate.getFullYear(),
		newAccessFromDate.getMonth(),
		newAccessFromDate.getDate(),
		18,
		0,
		0
	);

	if (isAfter(currentAccessToDate, addMinutes(newAccessFromDate, MINIMUM_VISIT_DURATION))) {
		// End date is valid for the newly selected start date
		return null;
	}

	if (
		isSameDay(newAccessFromDate, currentAccessToDate) ||
		isBefore(currentAccessToDate, newAccessFromDate)
	) {
		// if accessTo date is the same day as the accessFrom or of the accessTo is earlier
		// if the date is before 6pm - MINIMUM_VISIT_DURATION
		if (isBefore(newAccessFromDate, subMinutes(sixPm, MINIMUM_VISIT_DURATION))) {
			// before => update the accessTo to 6pm
			return sixPm;
		} else {
			// after => update the accessTo to newAccessFrom + MINIMUM_VISIT_DURATION
			return roundToNextQuarter(addMinutes(newAccessFromDate, MINIMUM_VISIT_DURATION));
		}
	} else {
		// if accessTo is a later day than the accessFrom date
		// differance between from and to dates is less than MINIMUM_VISIT_DURATION
		if (differenceInMinutes(newAccessFromDate, currentAccessToDate) < MINIMUM_VISIT_DURATION) {
			// less => update the accessTo to newAccessFrom + MINIMUM_VISIT_DURATION
			return roundToNextQuarter(addMinutes(newAccessFromDate, MINIMUM_VISIT_DURATION));
		} else {
			// more => return null (do nothing to the accessTo field)
			return null;
		}
	}
}

/**
 * We're not using the build in date-fns roundToNearestMinutes function since it contains a bug
 * https://github.com/date-fns/date-fns/issues/3129
 * @param oldDate
 */
export function roundToNextQuarter(oldDate: Date): Date {
	const minutes = Math.ceil(oldDate.getTime() / 1000 / 60 / 15) * 15;
	return new Date(minutes * 60 * 1000);
}
