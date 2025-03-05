import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormProps } from '@visitor-space/types';

import { AutocompleteFieldFilterForm } from '../AutocompleteFieldFilterForm/AutocompleteFieldFilterForm';

export const LocationCreatedFilterForm: FC<DefaultFilterFormProps> = ({
	className,
	onSubmit,
	onReset,
	id,
	disabled,
	initialValues,
	label,
}) => {
	return (
		<AutocompleteFieldFilterForm
			className={className}
			autocompleteField={AutocompleteField.LocationCreated}
			filterTitle={tText(
				'modules/visitor-space/components/location-created-filter-form/location-created-filter-form___plaats-van-uitgave'
			)}
			fieldLabel={tText(
				'modules/visitor-space/components/location-created-filter-form/location-created-filter-form___plaatsnaam'
			)}
			id={id}
			onSubmit={onSubmit}
			onReset={onReset}
			initialValues={initialValues}
			disabled={disabled}
			label={label}
		/>
	);
};
