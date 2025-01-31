import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { selectIeObjectsFilterOptions } from '@shared/store/ie-objects/ie-objects.select';
import {
	type LanguageCode,
	LANGUAGES,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { sortFilterOptions } from '@visitor-space/utils/sort-filter-options';

export const LanguageSelect: FC<ReactSelectProps> = (props) => {
	const locale = useLocale();

	const filterOptions: string[] =
		useSelector(selectIeObjectsFilterOptions)?.[ElasticsearchFieldNames.Language]?.buckets?.map(
			(option) => option.key
		) || [];

	const options = sortFilterOptions(
		(filterOptions || []).map((filterOption) => ({
			label: LANGUAGES[locale][filterOption as LanguageCode] || filterOption,
			value: filterOption,
		})),
		[]
	);

	const getPlaceholder = (): string | undefined => {
		return options.length === 0
			? tText(
					'modules/visitor-space/components/language-select/language-select___geen-talen-gevonden'
			  )
			: tText(
					'modules/visitor-space/components/language-select/language-select___kies-een-taal'
			  );
	};

	return <ReactSelect {...props} placeholder={getPlaceholder()} options={options} />;
};
