import { type FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { type DefaultFilterFormProps, SearchFilterId } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const LocationCreatedFilterForm: FC<DefaultFilterFormProps<any>> = ({
	children,
	className,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			searchFilterId={SearchFilterId.LocationCreated}
			filterTitle={tText('Plaats van uitgave')}
			fieldLabel={tText('Plaatsnaam')}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};
