import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

const ObjectTypeSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();
	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[
			ElasticsearchFieldNames.ObjectType
		]?.buckets?.map((filterOption) => filterOption.key) || [];

	const selectOptions = sortFilterOptions(
		filterOptions.map((option) => ({
			label: option,
			value: option,
		})),
		[]
	);

	// Bind to defaultProps to access externally
	ObjectTypeSelect.defaultProps = { options: selectOptions };

	const getPlaceholder = (): string | undefined => {
		return selectOptions.length === 0
			? tText(
					'modules/visitor-space/components/object-type-select/object-type-select___geen-object-types-gevonden'
			  )
			: tText(
					'modules/visitor-space/components/object-type-select/object-type-select___kies-een-object-type'
			  );
	};

	return (
		<ReactSelect
			{...props}
			placeholder={getPlaceholder()}
			options={ObjectTypeSelect.defaultProps.options}
		/>
	);
};

export default ObjectTypeSelect;
