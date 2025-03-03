import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const NewspaperSeriesNameFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	onSubmit,
	onReset,
	id,
	disabled,
	initialValue,
	label,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.NewspaperSeriesName}
			filterTitle={tText(
				'modules/visitor-space/components/newspaper-series-name-filter-form/newspaper-series-name-filter-form___krant-serie'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/newspaper-series-name-filter-form/newspaper-series-name-filter-form___naam-van-de-krant-serie'
			)}
			id={id}
			onSubmit={onSubmit}
			onReset={onReset}
			initialValue={initialValue}
			disabled={disabled}
			label={label}
		/>
	);
};
