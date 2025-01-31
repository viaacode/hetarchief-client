import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const NewspaperSeriesNameFilterForm: FC<DefaultFilterFormProps<any>> = ({
	children,
	className,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.newspaperSeriesName}
			filterTitle={tText(
				'modules/visitor-space/components/newspaper-series-name-filter-form/newspaper-series-name-filter-form___krant-serie'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/newspaper-series-name-filter-form/newspaper-series-name-filter-form___naam-van-de-krant-serie'
			)}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};
