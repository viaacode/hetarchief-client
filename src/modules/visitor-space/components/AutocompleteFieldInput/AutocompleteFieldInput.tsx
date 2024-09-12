import { type SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useCallback } from 'react';
import { type ActionMeta, type SingleValue } from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';

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

const MIN_WORD_LENGTH_FOR_AUTOCOMPLETE = 3;

const AutocompleteFieldInput: FC<AutocompleteFieldInputProps> = ({
	onChange,
	value,
	fieldName,
	label,
}) => {
	const handleLoadOptions = useCallback(
		(inputValue: string, callback: (newOptions: SelectOption[]) => void): void => {
			if (inputValue.length < MIN_WORD_LENGTH_FOR_AUTOCOMPLETE) {
				callback([]);
				return;
			}
			IeObjectsService.getAutocompleteFieldOptions(fieldName, inputValue).then((options) => {
				callback(options.map((option) => ({ label: option, value: option })));
			});
		},
		[fieldName]
	);

	const handleChange = (
		newValue: SingleValue<SelectOption>,
		actionMeta: ActionMeta<SelectOption>
	): void => {
		if (actionMeta.action === 'select-option' || actionMeta.action === 'create-option') {
			onChange(newValue?.value || null);
		}
	};

	return (
		<AsyncCreatableSelect<SelectOption>
			aria-label={label}
			className={clsx(styles['c-autocomplete-field-input'], 'c-react-select')}
			classNamePrefix={'c-react-select'}
			createOptionPosition="first"
			allowCreateWhileLoading
			formatCreateLabel={(inputValue) => inputValue}
			defaultOptions={false}
			onChange={handleChange}
			loadOptions={handleLoadOptions}
			value={value ? { label: value, value: value } : undefined}
			placeholder={label}
			noOptionsMessage={() =>
				tText(
					'modules/visitor-space/components/autocomplete-field-input/autocomplete-field-input___geen-resultaten-gevonden'
				)
			}
			loadingMessage={() =>
				tText(
					'modules/visitor-space/components/autocomplete-field-input/autocomplete-field-input___laden'
				)
			}
		/>
	);
};

export default AutocompleteFieldInput;
