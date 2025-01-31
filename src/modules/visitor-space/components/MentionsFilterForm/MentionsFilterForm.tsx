import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const MentionsFilterForm: FC<DefaultFilterFormProps<any>> = ({ children, className }) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.mentions}
			filterTitle={tText(
				'modules/visitor-space/components/mentions-filter-form/mentions-filter-form___namenlijst-gesneuvelden'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/mentions-filter-form/mentions-filter-form___naam'
			)}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};
