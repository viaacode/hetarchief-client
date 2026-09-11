import type { SelectOption } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchOperator } from '@shared/types/ie-objects';

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

/** The two operators a text filter offers. */
export const getTextFilterOperatorOptions = (): SelectOption[] => {
	const labels = getOperatorLabels();

	return [
		{ label: labels.contains, value: IeObjectsSearchOperator.CONTAINS },
		{ label: labels.excludes, value: IeObjectsSearchOperator.CONTAINS_NOT },
	];
};

export const getTextFilterOperatorLabel = (op: IeObjectsSearchOperator): string =>
	getTextFilterOperatorOptions().find((option) => option.value === op)?.label as string;
