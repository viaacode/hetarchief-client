import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import { tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

const ObjectTypeSelect: FC<ReactSelectProps> = (props) => {
	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.ObjectType]?.buckets?.map(
			(filterOption) => filterOption.key
		) || [];

	const selectOptions = sortFilterOptions(
		filterOptions.map((option) => ({
			label: option,
			value: option,
		})),
		[]
	);

	const getPlaceholder = (): string | undefined => {
		return selectOptions.length === 0
			? tText(
					'modules/visitor-space/components/object-type-select/object-type-select___geen-object-types-gevonden'
				)
			: tText(
					'modules/visitor-space/components/object-type-select/object-type-select___kies-een-object-type'
				);
	};

	return <ReactSelect {...props} placeholder={getPlaceholder()} options={selectOptions} />;
};

export default ObjectTypeSelect;
