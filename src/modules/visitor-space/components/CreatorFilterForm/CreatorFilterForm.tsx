import { type FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { type DefaultFilterFormProps, SearchFilterId } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const CreatorFilterForm: FC<DefaultFilterFormProps<any>> = ({ children, className }) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			searchFilterId={SearchFilterId.Creator}
			filterTitle={tText(
				'modules/visitor-space/components/creator-filter-form/creator-filter-form___maker'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/creator-filter-form/creator-filter-form___naam-van-de-maker'
			)}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};
