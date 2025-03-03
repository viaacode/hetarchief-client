import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const CreatorFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	onSubmit,
	onReset,
	initialValue,
	disabled,
	id,
	label,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.Creator}
			filterTitle={tText(
				'modules/visitor-space/components/creator-filter-form/creator-filter-form___maker'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/creator-filter-form/creator-filter-form___naam-van-de-maker'
			)}
			onSubmit={onSubmit}
			onReset={onReset}
			initialValue={initialValue}
			disabled={disabled}
			id={id}
			label={label}
		/>
	);
};
