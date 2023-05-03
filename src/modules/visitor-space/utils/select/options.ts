import { SelectOption } from '@meemoo/react-components';

export const getSelectValue = (
	options: SelectOption[],
	optionValue: string | undefined | null
): SelectOption | undefined => {
	if (optionValue === undefined) {
		return {
			label: 'Select...',
			value: '',
		};
	}
	return options.find((option) => option.value === optionValue);
};
