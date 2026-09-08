import { IeObjectsService } from '@ie-objects/services';
import { Button, type SelectOption, TagList } from '@meemoo/react-components';
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
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ActionMeta, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useQueryParams } from 'use-query-params';
import styles from './AutocompleteFilterForm.module.scss';

/** The dropdown filters from this many characters on, per the ARC-3806 FA. */
export const AUTOCOMPLETE_MINIMUM_CHARACTERS = 3;

/** An empty field shows the initial list, so only a half typed search holds the dropdown back. */
const hasTooFewCharacters = (value: string): boolean => {
	const length = value.trim().length;
	return length > 0 && length < AUTOCOMPLETE_MINIMUM_CHARACTERS;
};

/**
 * A filter over a value list too long to show at once: pick from the dropdown, which filters from
 * three characters on, and the picked values gather as pills above the search field.
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

	const loadOptions = (
		newInputValue: string,
		callback: (options: SelectOption[]) => void
	): void => {
		if (!autocompleteField || hasTooFewCharacters(newInputValue)) {
			callback([]);
			return;
		}

		IeObjectsService.getAutocompleteFieldOptions(autocompleteField, newInputValue, searchFilters)
			.then((values) => callback(values.map((value) => ({ label: value, value }))))
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

	return (
		<>
			<div className={clsx(className, styles['c-autocomplete-filter-form'])}>
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
							// A value can be as long as a full newspaper title, so the pill cuts it off and
							// hands the whole value to the browser tooltip
							tags={selectedValues.map((value) => ({
								label: <span title={value}>{value}</span>,
								id: value,
								value,
							}))}
							variants="large"
						/>
					</div>
				)}

				<AsyncSelect<SelectOption>
					aria-label={filter.label}
					className={clsx('c-react-select', styles['c-autocomplete-filter-form__select'])}
					classNamePrefix="c-react-select"
					components={{
						IndicatorSeparator: () => null,
						DropdownIndicator: () => (
							<span className={styles['c-autocomplete-filter-form__indicators']}>
								{inputValue && (
									<Button
										variants={['text', 'icon', 'xxs']}
										icon={<Icon name={IconNamesLight.Times} aria-hidden />}
										ariaLabel={tText(
											'modules/visitor-space/components/autocomplete-filter-form/autocomplete-filter-form___wissen'
										)}
										onClick={() => setInputValue('')}
									/>
								)}
								<Icon name={IconNamesLight.Search} aria-hidden />
							</span>
						),
					}}
					// The initial list, as the search filter of this field showed before ARC-3806
					defaultOptions
					// A value can be picked only once. The initial list is cached, so this runs on
					// render rather than on the fetch.
					filterOption={(option) => !selectedValues.includes(option.value)}
					inputId={`autocomplete-filter-form-${filter.id}`}
					isDisabled={disabled}
					inputValue={inputValue}
					loadOptions={loadOptions}
					noOptionsMessage={() =>
						hasTooFewCharacters(inputValue)
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
