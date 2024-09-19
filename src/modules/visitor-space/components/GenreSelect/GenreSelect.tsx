import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import { type FC } from 'react';
import { useSelector } from 'react-redux';

import { tText } from '@shared/helpers/translate';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

const GenreSelect: FC<ReactSelectProps> = (props) => {
	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Genre]?.buckets?.map(
			(option) => option.key
		) || [];

	const options = sortFilterOptions(
		(filterOptions || []).map((filterOption) => ({
			label: filterOption,
			value: filterOption,
		})),
		[]
	);

	const getPlaceholder = (): string | undefined => {
		return options.length === 0
			? tText(
					'modules/visitor-space/components/genre-select/genre-select___geen-genres-gevonden'
			  )
			: tText('modules/visitor-space/components/genre-select/genre-select___kies-een-genre');
	};

	return <ReactSelect {...props} placeholder={getPlaceholder()} options={options} />;
};

export default GenreSelect;
