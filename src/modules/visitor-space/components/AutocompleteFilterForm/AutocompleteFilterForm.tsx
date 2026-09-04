import { IeObjectsService } from '@ie-objects/services';
import { type SelectOption, TagList } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { AUTOCOMPLETE_FIELD_BY_FILTER_ID } from '@visitor-space/const/autocomplete-fields.const';
import { useSearchQueryFilters } from '@visitor-space/hooks/get-search-query-filters';
import type { GenericFilterFormProps } from '@visitor-space/types';
import clsx from 'clsx';
import { compact, without } from 'es-toolkit/compat';
import { type FC, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ActionMeta, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useQueryParams } from 'use-query-params';
import styles from './AutocompleteFilterForm.module.scss';

/** No dropdown before this many characters, per the ARC-3806 FA. */
export const AUTOCOMPLETE_MINIMUM_CHARACTERS = 3;

/**
 * A filter over a value list too long to show at once: type at least three characters, pick from
 * the dropdown, and the picked values gather as pills above the search field.
 * See the "Autocomplete filters" section of the ARC-3806 FA.
 */
export const AutocompleteFilterForm: FC<GenericFilterFormProps> = ({
	children,
	className,
	filter,
	disabled,
}) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const searchFilters = useSearchQueryFilters();

	const appliedValues: string[] = compact(query[filter.id] || []);
	const [selectedValues, setSelectedValues] = useState<string[]>(() => appliedValues);
	const [inputValue, setInputValue] = useState<string>('');

	const { reset, handleSubmit } = useForm({ defaultValues: {} });

	const autocompleteField = AUTOCOMPLETE_FIELD_BY_FILTER_ID[filter.id];

	// Leave this filter out of the query, so the user can still widen their own selection
	const otherFilters = useMemo(
		() => searchFilters.filter((searchFilter) => searchFilter.field !== filter.field),
		[searchFilters, filter.field]
	);

	const loadOptions = (
		newInputValue: string,
		callback: (options: SelectOption[]) => void
	): void => {
		if (newInputValue.trim().length < AUTOCOMPLETE_MINIMUM_CHARACTERS || !autocompleteField) {
			callback([]);
			return;
		}

		IeObjectsService.getAutocompleteFieldOptions(autocompleteField, newInputValue, otherFilters)
			.then((values) => {
				// A value can be selected only once
				callback(
					values
						.filter((value) => !selectedValues.includes(value))
						.map((value) => ({ label: value, value }))
				);
			})
			.catch(() => {
				toastService.notify({
					title: tText(
						'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___error'
					),
					description: tText(
						'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___het-ophalen-van-de-suggesties-is-mislukt'
					),
				});
			});
	};

	const onChange = (
		newValue: SingleValue<SelectOption>,
		actionMeta: ActionMeta<SelectOption>
	): void => {
		if (actionMeta.action !== 'select-option' || !newValue?.value) {
			return;
		}
		// Picking a value keeps the values picked earlier
		if (!selectedValues.includes(newValue.value)) {
			setSelectedValues([...selectedValues, newValue.value]);
		}
		setInputValue('');
	};

	const hasTooFewCharacters = inputValue.trim().length < AUTOCOMPLETE_MINIMUM_CHARACTERS;

	return (
		<>
			<div className={clsx(className, styles['c-autocomplete-filter-form'], 'u-px-32 u-px-20-md')}>
				{selectedValues.length > 0 && (
					<div className={styles['c-autocomplete-filter-form__selection']}>
						<p className={styles['c-autocomplete-filter-form__selection-label']}>
							{tHtml(
								'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___geselecteerd'
							)}
						</p>
						<TagList
							className="u-mb-0"
							closeIcon={<Icon name={IconNamesLight.Times} aria-hidden />}
							onTagClosed={(id) => setSelectedValues(without(selectedValues, id as string))}
							tags={selectedValues.map((value) => ({ label: value, id: value, value }))}
							variants="large"
						/>
					</div>
				)}

				<AsyncSelect<SelectOption>
					aria-label={filter.label}
					className="c-react-select"
					classNamePrefix="c-react-select"
					inputId={`autocomplete-filter-form-${filter.id}`}
					isDisabled={disabled}
					inputValue={inputValue}
					loadOptions={loadOptions}
					noOptionsMessage={() =>
						hasTooFewCharacters
							? tText(
									'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___geef-minstens-3-karakters-in'
								)
							: tText(
									'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___geen-resultaten-gevonden'
								)
					}
					loadingMessage={() =>
						tText(
							'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___laden'
						)
					}
					onChange={onChange}
					onInputChange={(newInputValue, actionMeta) => {
						if (actionMeta.action === 'input-change') {
							setInputValue(newInputValue);
						}
					}}
					placeholder={tText(
						'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___zoek'
					)}
					value={null}
				/>
			</div>

			{children({
				values: { [filter.id]: selectedValues },
				reset: () => {
					reset();
					setSelectedValues([]);
					setInputValue('');
				},
				handleSubmit,
			})}
		</>
	);
};
