import type { SelectOption } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useCallback } from 'react';
import type { ActionMeta, SingleValue } from 'react-select';

import { IeObjectsService } from '@ie-objects/services';
import { tText } from '@shared/helpers/translate';
import type { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';

import AsyncSelect from 'react-select/async';
import styles from './AutocompleteFieldInput.module.scss';

export interface AutocompleteFieldInputProps {
	label?: string;
	fieldName: AutocompleteField;
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
		if (actionMeta.action === 'select-option') {
			onChange(newValue?.value || null);
		}
	};

	return (
		<AsyncSelect<SelectOption>
			aria-label={label}
			className={clsx(styles['c-autocomplete-field-input'], 'c-react-select')}
			classNamePrefix={'c-react-select'}
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
