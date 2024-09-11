import { type FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { type DefaultFilterFormProps, SearchFilterId } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const MentionsFilterForm: FC<DefaultFilterFormProps<any>> = ({ children, className }) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			searchFilterId={SearchFilterId.Mentions}
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
