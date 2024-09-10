import { type FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { type DefaultFilterFormProps, SearchFilterId } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const MentionsFilterForm: FC<DefaultFilterFormProps<any>> = ({ children, className }) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			searchFilterId={SearchFilterId.Mentions}
			filterTitle={tText('Namenlijst gesneuvelden')}
			fieldLabel={tText('Naam')}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};
