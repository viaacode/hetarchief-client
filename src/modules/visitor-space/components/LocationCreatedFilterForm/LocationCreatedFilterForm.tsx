import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const LocationCreatedFilterForm: FC<DefaultFilterFormProps<any>> = ({
	children,
	className,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.locationCreated}
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
