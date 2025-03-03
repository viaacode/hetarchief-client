import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { noop, without } from 'lodash-es';
import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrayParam, useQueryParam } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterMultiValue } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import {
	type DefaultFilterFormProps,
	ElasticsearchFieldNames,
	type FilterValue,
} from '@visitor-space/types';
import { getInitialFilterValue } from '@visitor-space/utils/get-initial-filter-value';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

export const MediumFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	id,
	initialValues,
	onSubmit,
	onReset,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(
		IeObjectsSearchFilterField.MEDIUM,
		ArrayParam
	);
	const [search, setSearch] = useState<string>('');
	const [value, setValue] = useState<FilterValue>(
		getInitialFilterValue(id, initialValues?.[0], initialValueFromQueryParams)
	);

	const selectedMediums = value.multiValue || [];

	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Medium]?.buckets?.map(
			(option) => option.key
		) || [];
	const filteredOptions = filterOptions.filter((filterOption) =>
		filterOption.toLowerCase().includes(search.toLowerCase())
	);

	// Make sure applied values are sorted at the top of the list
	// Options selected by the user should remain in their alphabetical order until the filter is applied
	// https://meemoo.atlassian.net/browse/ARC-1882
	const checkboxOptions = sortFilterOptions(
		filteredOptions.map((filterOption) => ({
			label: filterOption,
			value: filterOption,
			checked: selectedMediums.includes(filterOption),
		})),
		initialValues?.[0]?.multiValue || []
	);

	const handleSubmit = async () => {
		onSubmit([value]);
	};

	const handleReset = () => {
		setValue(initialFilterMultiValue());
		onReset();
	};

	const onItemClick = (add: boolean, newValue: string) => {
		const selected = add ? [...selectedMediums, newValue] : without(selectedMediums, newValue);
		setValue({
			...value,
			multiValue: selected,
		});
	};

	return (
		<>
			<div className={clsx(className, 'u-px-20 u-px-32-md')} key={`filter--${id}`}>
				<SearchBar
					id={`${visitorSpaceLabelKeys.filters.title}--${IeObjectsSearchFilterField.MEDIUM}`}
					value={search}
					variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
					placeholder={tText(
						'modules/visitor-space/components/medium-filter-form/medium-filter-form___zoek'
					)}
					onChange={setSearch}
					onSearch={noop}
				/>

				<div className="c-filter-form__body--scrollable">
					{filterOptions.length === 0 && (
						<p className="u-color-neutral u-text-center">
							{tHtml(
								'modules/visitor-space/components/medium-filter-form/medium-filter-form___geen-analoge-dragers-gevonden'
							)}
						</p>
					)}

					<CheckboxList
						items={checkboxOptions}
						onItemClick={(checked, value) => {
							onItemClick(!checked, value as string);
						}}
					/>
				</div>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};
