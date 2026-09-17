import { CheckboxList } from '@meemoo/react-components';
import { SearchBar } from '@shared/components/SearchBar';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { tHtml, tText } from '@shared/helpers/translate';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import { useGetFilterOptions } from '@visitor-space/hooks/get-filter-options';
import type { GenericFilterFormProps } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';
import clsx from 'clsx';
import { compact, noop, without } from 'es-toolkit/compat';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import styles from './CheckboxListFilterForm.module.scss';

/** Up to this many options the filter opens without a search field. See the FA of ARC-3806. */
export const MAX_OPTIONS_WITHOUT_SEARCH = 10;

/**
 * A filter with a list of values, one checkbox per value. A list of more than ten values also
 * gets a search field over every possible value.
 * See the "Checkbox filters" section of the ARC-3806 FA.
 */
export const CheckboxListFilterForm: FC<GenericFilterFormProps> = ({
	children,
	className,
	filter,
	disabled,
}) => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>('');

	const appliedValues: string[] = compact(query[filter.id] || []);
	const [selectedValues, setSelectedValues] = useState<string[]>(() => appliedValues);

	const { reset, handleSubmit } = useForm({ defaultValues: {} });
	const fixedOptions = filter.options?.();
	const { options: aggregatedOptions, isLoading } = useGetFilterOptions(
		filter,
		!disabled && !fixedOptions
	);
	const options = fixedOptions ?? aggregatedOptions;

	// The search field appears and disappears with the number of options the filter offers, so a
	// filter whose aggregation returns few values never shows one.
	const isSearchable = options.length > MAX_OPTIONS_WITHOUT_SEARCH;

	const matchingOptions = isSearchable
		? options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
		: options;

	// The applied selection sits on top, alphabetically, then the rest alphabetically. Options the
	// user ticks in this session keep their place until the filter is applied.
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		matchingOptions.map((option) => ({
			label: option.label,
			value: option.value,
			checked: selectedValues.includes(option.value),
		})),
		appliedValues
	);

	const onItemClick = (checked: boolean, value: unknown): void => {
		setSelectedValues(
			checked ? without(selectedValues, value as string) : [...selectedValues, value as string]
		);
	};

	return (
		<>
			<div
				className={clsx(className, styles['c-checkbox-filter-form__body'], 'u-px-32 u-px-20-md')}
			>
				{isSearchable && (
					<SearchBar
						className={styles['c-checkbox-filter-form__search']}
						id={`${visitorSpaceLabelKeys.filters.title}--${filter.id}`}
						value={search}
						variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
						placeholder={tText(
							'modules/visitor-space/components/checkbox-list-filter-form/checkbox-list-filter-form___zoek'
						)}
						onChange={setSearch}
						onSearch={noop}
						ariaLabel={tText(
							'modules/visitor-space/components/checkbox-list-filter-form/checkbox-list-filter-form___zoek-binnen-filter-input-aria-label',
							{ filterName: filter.label }
						)}
					/>
				)}

				<div
					className={clsx(styles['c-checkbox-filter-form__list'], {
						[styles['c-checkbox-filter-form__list--searchable']]: isSearchable,
						[styles['c-checkbox-filter-form__list--empty']]:
							isLoading || matchingOptions.length === 0,
					})}
				>
					{isLoading && (
						<div className="u-text-center">
							<Spinner />
						</div>
					)}

					{!isLoading && matchingOptions.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/checkbox-list-filter-form/checkbox-list-filter-form___geen-waarden-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						items={checkboxOptions}
						onItemClick={onItemClick}
						id={`checkbox-list-filter-form-${filter.id}`}
					/>
				</div>
			</div>

			{children({
				values: { [filter.id]: selectedValues },
				reset: () => {
					reset();
					setSelectedValues([]);
					setSearch('');
				},
				handleSubmit,
			})}
		</>
	);
};
