import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const MentionsFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	initialValue,
	onReset,
	onSubmit,
	disabled,
	id,
	label,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.Mentions}
			filterTitle={tText(
				'modules/visitor-space/components/mentions-filter-form/mentions-filter-form___namenlijst-gesneuvelden'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/mentions-filter-form/mentions-filter-form___naam'
			)}
			onSubmit={onSubmit}
			onReset={onReset}
			id={id}
			initialValue={initialValue}
			disabled={disabled}
			label={label}
		/>
	);
};
