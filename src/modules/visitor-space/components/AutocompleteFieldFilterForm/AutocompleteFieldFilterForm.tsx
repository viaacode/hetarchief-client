import { FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { useQueryParam } from 'use-query-params';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import AutocompleteFieldInput from '@visitor-space/components/AutocompleteFieldInput/AutocompleteFieldInput';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';

import { validateForm } from '@shared/helpers/validate-form';
import FilterFormButtons from '@visitor-space/components/FilterMenu/FilterFormButtons/FilterFormButtons';
import type { DefaultFilterFormProps, FilterValue } from '@visitor-space/types';
import {
	FILTER_FORM_SCHEMA,
	initialFilterValues,
} from '../AdvancedFilterForm/AdvancedFilterForm.const';

import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import { compact } from 'lodash-es';
import styles from './AutocompleteFieldFilterForm.module.scss';

interface AutocompleteFieldFilterFormProps extends DefaultFilterFormProps {
	autocompleteField: AutocompleteField;
	filterTitle: string;
	fieldLabel: string;
}

export const AutocompleteFieldFilterForm: FC<AutocompleteFieldFilterFormProps> = ({
	id,
	className,
	autocompleteField,
	filterTitle,
	fieldLabel,
	onSubmit,
	onReset,
	initialValues,
}) => {
	const [initialValueFromQueryParams] = useQueryParam(autocompleteField, AdvancedFilterArrayParam);
	const [values, setValues] = useState<FilterValue[]>(
		initialValues || initialValueFromQueryParams || initialFilterValues(id)
	);
	const [formErrors, setFormErrors] = useState<Record<string, string> | null>(null);

	const handleSubmit = async () => {
		const errors = await validateForm(values, FILTER_FORM_SCHEMA());
		setFormErrors(errors);
		if (!errors) {
			onSubmit(values);
		}
	};

	const handleReset = () => {
		setValues(initialFilterValues(id));
		onReset();
	};

	const handleInputChange = (newValue: string | null) => {
		setValues([
			{
				...values[0],
				multiValue: compact([newValue || undefined]),
			},
		]);
	};

	return (
		<>
			<div
				className={clsx(className, styles['c-creator-filter-form__input'], 'u-px-20 u-px-32-md')}
			>
				<FormControl
					className="c-form-control--label-hidden"
					errors={[
						<RedFormWarning error={formErrors?.[autocompleteField]} key="form-error--value" />,
					]}
					id={`AutocompleteFieldFilterForm__${autocompleteField}`}
					label={filterTitle}
				>
					<AutocompleteFieldInput
						fieldName={autocompleteField}
						onChange={handleInputChange}
						value={values?.[0]?.multiValue?.[0]}
						id={AutocompleteField.Creator}
						label={fieldLabel}
					/>
				</FormControl>
			</div>

			<FilterFormButtons onSubmit={handleSubmit} onReset={handleReset} />
		</>
	);
};
