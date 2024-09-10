import { type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useCallback } from 'react';
import { type ActionMeta, type SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';

import { IeObjectsService } from '@ie-objects/services';
import { tText } from '@shared/helpers/translate';

import styles from './AutocompleteFieldInput.module.scss';

export interface AutocompleteFieldInputProps {
	label?: string;
	fieldName: string;
	disabled?: boolean;
	id?: string;
	onChange: (value: string | null) => void;
	value?: string;
	className?: string;
}

const AutocompleteFieldInput: FC<AutocompleteFieldInputProps> = ({
	onChange,
	value,
	fieldName,
	label,
}) => {
	const handleLoadOptions = useCallback(
		(inputValue: string, callback: (newOptions: SelectOption[]) => void): void => {
			if (inputValue.length < 3) {
				callback([]);
				return;
			}
			IeObjectsService.getAutocompleteFieldOptions(fieldName, inputValue).then((options) => {
				callback(options.map((option) => ({ label: option, value: option })));
			});
		},
		[fieldName]
	);

	function handleChange(
		newValue: SingleValue<SelectOption>,
		actionMeta: ActionMeta<SelectOption>
	): void {
		if (actionMeta.action === 'select-option') {
			onChange(newValue?.value || null);
		}
	}

	return (
		<AsyncSelect<SelectOption>
			aria-label={label}
			className={clsx(styles['c-autocomplete-field-input'], 'c-react-select')}
			classNamePrefix={'c-react-select'}
			cacheOptions
			defaultOptions={false}
			onChange={handleChange}
			loadOptions={handleLoadOptions}
			value={value ? { label: value, value: value } : undefined}
			placeholder={label}
			noOptionsMessage={() => tText('Geen resultaten gevonden')}
			loadingMessage={() => tText('Laden...')}
		/>
	);
};

export default AutocompleteFieldInput;
