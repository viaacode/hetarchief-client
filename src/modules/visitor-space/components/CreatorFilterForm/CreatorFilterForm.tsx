import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from 'use-query-params';

import useTranslation from '@shared/hooks/use-translation/use-translation';
import { CREATOR_FILTER_FORM_SCHEMA, CreatorFilterFormState } from '@visitor-space/components';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import { CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG } from './CreatorFilterForm.const';
import styles from './CreatorFilterForm.module.scss';
import { CreatorFilterFormProps } from './CreatorFilterForm.types';

const defaultValues: CreatorFilterFormState = {
	creators: [''],
};

const CreatorFilterForm: FC<CreatorFilterFormProps> = ({ children, className }) => {
	const { tText } = useTranslation();

	// State
	const [query] = useQueryParams(CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG);

	const initial = query?.[VisitorSpaceFilterId.Creator] || '';

	const [form, setForm] = useState<CreatorFilterFormState>({ creators: [initial] });
	const {
		clearErrors,
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<CreatorFilterFormState>({
		resolver: yupResolver(CREATOR_FILTER_FORM_SCHEMA()),
		defaultValues,
		reValidateMode: 'onChange',
	});

	// Effects

	useEffect(() => {
		setValue('creators', form.creators);
	}, [form, setValue]);

	useEffect(() => {
		if (initial) {
			setForm((oldForm) => ({ ...oldForm, duration: initial }));
		}
	}, [initial]);

	// Events

	const onChangeCreator = (evt: ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, creators: [evt.target.value] });
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
					errors={
						!isNil(errors.creators?.[0]?.message)
							? [errors.creators?.[0]?.message]
							: undefined
					}
					id="CreatorFilterForm__creator"
					label={tText(
						'modules/visitor-space/components/creator-filter-form/creator-filter-form___maker'
					)}
				>
					<Controller
						control={control}
						name="creators"
						render={({ field }) => (
							<TextInput
								{...field}
								value={form.creators?.[0] || defaultValues.creators?.[0] || ''}
								onChange={onChangeCreator}
								placeholder={tText(
									'modules/visitor-space/components/creator-filter-form/creator-filter-form___naam-van-de-maker'
								)}
							/>
						)}
					/>
				</FormControl>
			</div>

			{children({
				values: form,
				reset: () => {
					setForm(defaultValues);
					clearErrors();
				},
				handleSubmit,
			})}
		</>
	);
};

export default CreatorFilterForm;
