// 2-letter for url parsing

export const FILTER_LABEL_VALUE_DELIMITER = '---';

/**
 * Inside the client this enum is used for the operator values
 * But these are converted to simpler values for the backend: ServerOperator
 */
export enum Operator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	IS = 'is',
	IS_NOT = 'isNot',
	LTE = 'lte', // shorter (duration) or until (date)
	GTE = 'gte', // longer (duration) or after (date)
	BETWEEN = 'between', // duration & date, between 2 dates, is converted on the backend to GTE and LTE
	EXACT = 'exact', // duration & date: exactly on one day, but is stored as start and end date
}
