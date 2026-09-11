import { SEPARATOR } from '@shared/const';
import { IeObjectsSearchOperator } from '@shared/types/ie-objects';

export function convertYearToDate(yearString: string, operator: IeObjectsSearchOperator): string {
	// No trailing Z since we can't these dates to be interpreted as belgian time, not utc time
	// Since we only have the year and the year is entered as belgian time
	// otherwise end of year jumps from 31/12/2009 => 01/01/2010
	const startOfYear = yearString ? `${yearString}-01-01T00:00:00` : '';
	const endOfYear = yearString ? `${yearString}-12-31T23:59:59` : '';

	if (operator === IeObjectsSearchOperator.IS) {
		return `${startOfYear}${SEPARATOR}${endOfYear}`;
	}

	if (operator === IeObjectsSearchOperator.LTE) {
		return endOfYear;
	}

	return startOfYear;
}
