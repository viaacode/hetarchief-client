import { CheckboxList } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, noop, without } from 'lodash-es';
import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryParam } from 'use-query-params';

import { SearchBar } from '@shared/components/SearchBar';
import { tHtml, tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { initialFilterValues } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm.const';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import {
	type DefaultFilterFormProps,
	ElasticsearchFieldNames,
	type FilterValue,
} from '@visitor-space/types';
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
		AdvancedFilterArrayParam
	);
	const [search, setSearch] = useState<string>('');
	const [values, setValues] = useState<FilterValue[]>(
		initialValues || initialValueFromQueryParams || initialFilterValues(id)
	);

	const selectedMediums = values[0].multiValue || [];

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
		compact(initialValues?.[0]?.multiValue || [])
	);

	const handleSubmit = async () => {
		onSubmit(values);
	};

	const handleReset = () => {
		setValues(initialFilterValues(id));
		onReset();
	};

	const onItemClick = (add: boolean, newValue: string) => {
		const selected = add ? [...selectedMediums, newValue] : without(selectedMediums, newValue);
		setValues([
			{
				...values[0],
				multiValue: selected,
			},
		]);
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
