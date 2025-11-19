import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl } from '@meemoo/react-components';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import AutocompleteFieldInput from '@visitor-space/components/AutocompleteFieldInput/AutocompleteFieldInput';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { DefaultFilterFormChildrenParams } from '@visitor-space/types';
import clsx from 'clsx';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StringParam, useQueryParam } from 'use-query-params';
import { object as yupObject, string as yupString } from 'yup';
import styles from './AutocompleteFieldFilterForm.module.scss';

export const AutocompleteFieldFilterForm: FC<{
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	children: ({ values, reset, handleSubmit }: DefaultFilterFormChildrenParams<any>) => ReactNode;
	className?: string;
	autocompleteField: AutocompleteField;
	filterTitle: string;
	fieldLabel: string;
}> = ({ children, className, autocompleteField, filterTitle, fieldLabel }) => {
	const [initial] = useQueryParam(autocompleteField, StringParam);

	const getAutocompleteErrorMessage = (field: AutocompleteField) => {
		switch (field) {
			case AutocompleteField.creator:
				return tText(
					'modules/visitor-space/components/autocomplete-field-filter-form/autocomplete-field-filter-form___de-naam-van-de-maker-is-een-verplicht-veld'
				);

			case AutocompleteField.newspaperSeriesName:
				return tText(
					'modules/visitor-space/components/autocomplete-field-filter-form/autocomplete-field-filter-form___de-naam-van-de-krant-serie-is-een-verplicht-veld'
				);

			case AutocompleteField.locationCreated:
				return tText(
					'modules/visitor-space/components/autocomplete-field-filter-form/autocomplete-field-filter-form___de-locatie-waar-het-object-is-gemaakt-is-een-verplicht-veld'
				);

			case AutocompleteField.mentions:
				return tText(
					'modules/visitor-space/components/autocomplete-field-filter-form/autocomplete-field-filter-form___de-naam-van-de-persoon-is-een-verplicht-veld'
				);

			default:
				return '';
		}
	};

	const [form, setForm] = useState<{ value: string }>({
		value: initial || '',
	});
	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<{ value: string }>({
		resolver: yupResolver(
			yupObject({
				value: yupString().required(getAutocompleteErrorMessage(autocompleteField)),
			})
		),
		defaultValues: { value: '' },
		reValidateMode: 'onChange',
	});

	// Effects

	useEffect(() => {
		setValue('value', form.value);
	}, [form, setValue]);

	useEffect(() => {
		if (initial) {
			setForm((oldForm) => ({ ...oldForm, value: initial }));
		}
	}, [initial]);

	// Events

	const onChangeValue = (newCreator: string | null) => {
		setForm((oldForm) => ({ ...oldForm, value: newCreator || '' }));
	};

	return (
		<>
			<div
				className={clsx(className, styles['c-creator-filter-form__input'], 'u-px-32 u-px-20-md')}
			>
				<FormControl
					className="c-form-control--label-hidden"
					errors={[<RedFormWarning error={errors?.value?.message} key="form-error--value" />]}
					id={`AutocompleteFieldFilterForm__${autocompleteField}`}
					label={filterTitle}
				>
					<Controller
						control={control}
						name="value"
						render={({ field }) => (
							<AutocompleteFieldInput
								fieldName={autocompleteField}
								onChange={onChangeValue}
								value={field.value}
								id={AutocompleteField.creator}
								label={fieldLabel}
							/>
						)}
					/>
				</FormControl>
			</div>

			{children({
				values: { [autocompleteField]: form.value },
				reset: () => {
					setValue('value', '');
					clearErrors();
				},
				handleSubmit,
			})}
		</>
	);
};
