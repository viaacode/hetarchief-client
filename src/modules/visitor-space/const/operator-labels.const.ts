import type { SelectOption } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { Operator } from '@visitor-space/types';

/** The two operators a text filter offers, labelled in the language of the UI. */
export const getTextFilterOperatorOptions = (): SelectOption[] => [
	{
		label: tText('modules/visitor-space/const/text-filter-operators___bevat'),
		value: Operator.CONTAINS,
	},
	{
		label: tText('modules/visitor-space/const/text-filter-operators___bevat-niet'),
		value: Operator.CONTAINS_NOT,
	},
];

export const getTextFilterOperatorLabel = (op: Operator): string =>
	getTextFilterOperatorOptions().find((option) => option.value === op)?.label as string;
