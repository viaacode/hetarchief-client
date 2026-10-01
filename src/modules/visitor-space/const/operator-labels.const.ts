import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { SearchFilterId } from '@visitor-space/types';
import { getOperators } from '@visitor-space/utils/advanced-filters';

/**
 * Every operator label of the search page, in the language of the UI. One operator reads
 * differently per field, so the keys name the wording rather than the operator: GTE is "vanaf"
 * on a date and "langer dan" on a duration.
 */
export const getOperatorLabels = () => ({
	contains: tText('modules/visitor-space/const/operator-labels___bevat'),
	excludes: tText('modules/visitor-space/const/operator-labels___bevat-niet'),
	equals: tText('modules/visitor-space/const/operator-labels___is'),
	differs: tText('modules/visitor-space/const/operator-labels___is-niet'),
	from: tText('modules/visitor-space/const/operator-labels___vanaf'),
	until: tText('modules/visitor-space/const/operator-labels___tot-en-met'),
	between: tText('modules/visitor-space/const/operator-labels___tussen'),
	shorter: tText('modules/visitor-space/const/operator-labels___korter-dan'),
	longer: tText('modules/visitor-space/const/operator-labels___langer-dan'),
	exact: tText('modules/visitor-space/const/operator-labels___exact'),
});

export type OperatorLabels = ReturnType<typeof getOperatorLabels>;

/** The operators that exclude rather than include. Everything else reads as positive. */
const NEGATIVE_OPERATORS: IeObjectsSearchOperator[] = [
	IeObjectsSearchOperator.CONTAINS_NOT,
	IeObjectsSearchOperator.IS_NOT,
];

/**
 * Which operators a filter offers is FILTERS_OPTIONS_CONFIG's to say, and `getOperators` reads it.
 * A url can still carry an operator that is not in that list: a field's operators may have changed
 * since the url was shared, and a url can be typed by hand. Such an operator is read as positive
 * or negative and mapped onto the first operator of that polarity the field does offer, so an
 * `identifier` url carrying "co" opens on "Is" rather than on nothing at all.
 *
 * An operator the field does offer is returned untouched.
 */
export const normalizeTextFilterOperator = (
	op: IeObjectsSearchOperator,
	filterId: SearchFilterId
): IeObjectsSearchOperator => {
	const offered = getOperators(filterId).map((operator) => operator.value);

	if (offered.includes(op)) {
		return op;
	}

	const isNegative = NEGATIVE_OPERATORS.includes(op);

	return offered.find((offeredOp) => NEGATIVE_OPERATORS.includes(offeredOp) === isNegative) ?? op;
};

/** The label a filter puts on one of the operators it offers. */
export const getTextFilterOperatorLabel = (
	op: IeObjectsSearchOperator,
	filterId: SearchFilterId
): string => getOperators(filterId).find((operator) => operator.value === op)?.label ?? '';
