import { SEPARATOR } from '@shared/const';
import { Operator } from '@shared/types';

export function convertYearToDate(yearString: string, operator: Operator): string {
	const startOfYear = `${yearString}-01-01T00:00:00Z`;
	const endOfYear = `${yearString}-12-31T23:59:59Z`;

	if (operator === Operator.Equals) {
		return `${startOfYear}${SEPARATOR}${endOfYear}`;
	}

	if (operator === Operator.LessThanOrEqual) {
		return endOfYear;
	}

	return startOfYear;
}
