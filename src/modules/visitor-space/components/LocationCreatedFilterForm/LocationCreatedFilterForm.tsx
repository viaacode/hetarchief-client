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
			filterTitle={tText(
				'modules/visitor-space/components/location-created-filter-form/location-created-filter-form___plaats-van-uitgave'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/location-created-filter-form/location-created-filter-form___plaatsnaam'
			)}
		>
			{children}
		</AutocompleteFieldFilterForm>
	);
};