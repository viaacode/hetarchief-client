import { SelectOption } from '@meemoo/react-components';

import { tText } from '@shared/helpers/translate';

export const getSelectValue = (
	options: SelectOption[],
	optionValue: string | undefined | null
): SelectOption | undefined => {
	if (optionValue === undefined) {
		return {
			label: tText('modules/visitor-space/utils/select/options___select'),
			value: '',
		};
	}
	return options.find((option) => option.value === optionValue);
};
