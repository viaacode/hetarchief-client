import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StringParam, useQueryParam } from 'use-query-params';
import { object as yupObject, string as yupString } from 'yup';

import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import AutocompleteFieldInput from '@visitor-space/components/AutocompleteFieldInput/AutocompleteFieldInput';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { type DefaultFilterFormChildrenParams, type SearchFilterId } from '@visitor-space/types';

import styles from './AutocompleteFieldFilterForm.module.scss';

export const AutocompleteFieldFilterForm: FC<{
	children: ({ values, reset, handleSubmit }: DefaultFilterFormChildrenParams<any>) => ReactNode;
	className?: string;
	searchFilterId: SearchFilterId;
	filterTitle: string;
	fieldLabel: string;
}> = ({ children, className, searchFilterId, filterTitle, fieldLabel }) => {
	const [initial] = useQueryParam(searchFilterId, StringParam);

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
				value: yupString().required(),
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
				className={clsx(
					className,
					styles['c-creator-filter-form__input'],
					'u-px-20 u-px-32:md'
				)}
			>
				<FormControl
					className="c-form-control--label-hidden"
					errors={[
						<RedFormWarning error={errors?.value?.message} key="form-error--value" />,
					]}
					id={'AutocompleteFieldFilterForm__' + searchFilterId}
					label={filterTitle}
				>
					<Controller
						control={control}
						name="value"
						render={({ field }) => (
							<AutocompleteFieldInput
								fieldName={searchFilterId}
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
				values: { [searchFilterId]: form.value },
				reset: () => {
					setForm({ value: '' });
					clearErrors();
				},
				handleSubmit,
			})}
		</>
	);
};
