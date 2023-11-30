import { SEPARATOR } from '@shared/const';
import { Operator } from '@shared/types';

export function convertYearToDate(yearString: string, operator: Operator): string {
	// No trailing Z since we can't these dates to be interpreted as belgian time, not utc time
	// Since we only have the year and the year is entered as belgian time
	// otherwise end of year jumps from 31/12/2009 => 01/01/2010
	const startOfYear = `${yearString}-01-01T00:00:00`;
	const endOfYear = `${yearString}-12-31T23:59:59`;

	if (operator === Operator.Equals) {
		return `${startOfYear}${SEPARATOR}${endOfYear}`;
	}

	if (operator === Operator.LessThanOrEqual) {
		return endOfYear;
	}

	return startOfYear;
}
