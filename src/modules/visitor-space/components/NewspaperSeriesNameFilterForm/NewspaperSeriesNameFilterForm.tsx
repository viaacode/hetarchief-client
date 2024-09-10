import { type FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { type DefaultFilterFormProps, SearchFilterId } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const NewspaperSeriesNameFilterForm: FC<DefaultFilterFormProps<any>> = ({
	children,
	className,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			searchFilterId={SearchFilterId.NewspaperSeriesName}
			filterTitle={tText('Krant serie')}
			fieldLabel={tText('Naam van de krant serie')}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};
