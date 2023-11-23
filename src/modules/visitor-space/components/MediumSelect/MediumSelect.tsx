import { ReactSelect, ReactSelectProps } from '@meemoo/react-components';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

const MediumSelect: FC<ReactSelectProps> = (props) => {
	const { tText } = useTranslation();
	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Medium]?.buckets?.map(
			(option) => option.key
		) || [];

	const selectOptions = sortFilterOptions(
		filterOptions.map((filterOption) => ({
			label: filterOption,
			value: filterOption,
		})),
		[]
	);

	// Bind to defaultProps to access externally
	MediumSelect.defaultProps = { options: selectOptions };

	const getPlaceholder = (): string | undefined => {
		return selectOptions.length === 0
			? tText(
					'modules/visitor-space/components/medium-select/medium-select___geen-analoge-dragers-gevonden'
			  )
			: tText(
					'modules/visitor-space/components/medium-select/medium-select___kies-een-analoge-drager'
			  );
	};

	return (
		<ReactSelect
			{...props}
			placeholder={getPlaceholder()}
			options={MediumSelect.defaultProps.options}
		/>
	);
};

export default MediumSelect;
