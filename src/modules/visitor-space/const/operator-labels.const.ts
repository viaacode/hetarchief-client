import type { SelectOption } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { SearchFilterId } from '@visitor-space/types';

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

/**
 * Text filters whose elasticsearch field is a keyword field rather than an analysed text field.
 * The operator stays CONTAINS / CONTAINS_NOT, but the match is on the whole value, so the wording
 * is "Is" / "Is niet" instead of "Bevat" / "Bevat niet".
 */
const EXACT_TEXT_FILTER_IDS: SearchFilterId[] = [SearchFilterId.Identifier];

/** The two operators a text filter offers. */
export const getTextFilterOperatorOptions = (filterId?: SearchFilterId): SelectOption[] => {
	const labels = getOperatorLabels();
	const isExact = !!filterId && EXACT_TEXT_FILTER_IDS.includes(filterId);

	return [
		{
			label: isExact ? labels.equals : labels.contains,
			value: IeObjectsSearchOperator.CONTAINS,
		},
		{
			label: isExact ? labels.differs : labels.excludes,
			value: IeObjectsSearchOperator.CONTAINS_NOT,
		},
	];
};

export const getTextFilterOperatorLabel = (
	op: IeObjectsSearchOperator,
	filterId?: SearchFilterId
): string =>
	getTextFilterOperatorOptions(filterId).find((option) => option.value === op)?.label as string;
